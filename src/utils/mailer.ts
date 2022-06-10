import SGmail from "@sendgrid/mail";
SGmail.setApiKey(process.env.SENDGRID_API_KEY);

const msg: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
} = {
  from: "m.shahzaib@ceative.co.uk",
  to: "",
  subject: "",
  text: ""
};

export const sendWelcomeEmail = (email: string, name: string) => {
  msg.to = email;
  msg.subject = "Thanks for joining!";
  msg.text = "Welcome to our app, Let us know how you get along the app!";
  SGmail.send(msg);
};

export const sendByeByeEmail = (email: string, name: string) => {
    msg.to = email;
    msg.subject = "Nice to have ypu!";
    msg.text = "Give suggestions to make our app better!";
    SGmail.send(msg);
  };
