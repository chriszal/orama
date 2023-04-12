import React, { useRef ,useState} from 'react';
import emailjs from '@emailjs/browser';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { ContactContainer, ContactWrapper, ContactRow, Column1, Column2, TextWrapper, TopLine, Heading, Subtitle, BtnWrap, FormWrap,Label ,InputPlaceholder,TextArea,Button} from './ContactElements';



const ContactUs = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);  
  const [isError, setIsError] = useState(false);
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(process.env.REACT_APP_EMAIL_JS_ID, process.env.REACT_APP_EMAIL_JS_TEMPLATE, form.current, process.env.REACT_APP_EMAIL_JS_PUBLIC_KEY)
      .then((result) => {
          console.log(result.text);
          if(result.text=="OK"){
            form.current.reset();
            setIsSent(true);
          }else{
            setIsError(true);
          }
      }, (error) => {
          console.log(error.text);
          setIsError(true);
      });
  };

  const handleClose = () => {
    setIsSent(false);
    setIsError(false);
    };

  return (
    <>
        <ContactContainer id='contact'>
            <ContactWrapper>
            <ContactRow >
                <Column1>
                <TextWrapper>
                    <TopLine>&gt;&gt;</TopLine>
                    <Heading >Get in Touch</Heading>
                    <Subtitle >We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, please fill out the form. We value your thoughts and opinions, so don't hesitate to reach out. We look forward to hearing from you!</Subtitle>
                </TextWrapper>
                </Column1>
                <Column2>
                <FormWrap>
                    <form ref={form} onSubmit={sendEmail}>
                        <Label>Name</Label>
                        <InputPlaceholder type="text" name="user_name" required />
                        <Label>Email</Label>
                        <InputPlaceholder type="email" name="user_email" required/>
                        <Label>Message</Label>
                        <TextArea name="message" required  />
                        <BtnWrap>
                            <Button type='submit'
                                smooth={true}
                                duration={500}
                                spy={true}
                                exact='true'
                                primary={1}
                                dark={1}
                                dark2={1}
                                offset={-80}
                                >Send
                            </Button>
                        </BtnWrap>
                    </form>
                </FormWrap>
                </Column2>
            </ContactRow>
            </ContactWrapper>
        </ContactContainer>
        <Snackbar open={isSent} autoHideDuration={5000} onClose={handleClose} message="Email sent successfully">
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Email sent successfully
            </Alert>
        </Snackbar>
        <Snackbar open={isError} autoHideDuration={5000} onClose={handleClose} message="Email failed to send">
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            Email failed to send
            </Alert>
        </Snackbar>
    </>
  );
};

export default ContactUs