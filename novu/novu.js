import { Novu } from '@novu/node'; 
import dotenv from "dotenv";


dotenv.config();

export const getNotification = async (title,description,email,Id) => {
    const novu = new Novu(process.env.NOVU_API_KEY);

    await novu.subscribers.identify(Id, {
        email: email,
        firstName: "Subscriber"
    });
    
    await novu.trigger('momentum--L67FbJvt', {
        to: {
          subscriberId: Id,
          email: email
        },
        payload: {
            title: title,
            description: description
        }
    });
}
