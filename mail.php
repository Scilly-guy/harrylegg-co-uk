<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('phpmailerexception.php');
require_once('phpmailer.php');
require_once('phpmailersmtp.php');

$to='harry.legg86@googlemail.com';
$subject='Email Via harrylegg.co.uk';
$err=false;
$msg=['status'=>400,'message'=>'mailer script failed'];



if(array_key_exists('name',$_POST)){
  $name=substr(strip_tags($_POST['name']),0,255);
}
else
{
  $name='';
}

if(array_key_exists('email',$_POST) && PHPMailer::validateAddress($_POST['email'])){
  $email=$_POST['email'];
}
else
{
  $msg=['message'=>'Invalid email address provided'];
  $err=true;
}

if(array_key_exists('message',$_POST)){
  $message=substr(strip_tags($_POST['message']),0,16384);
}
else{
  $msg=['message'=> 'No message provided'];
  $err=true;
}

if(!$err){
  $mail = new PHPMailer(true);
  
  try{
  $mail->isSMTP();
  $mail->Host = 'smtp.gmail.com';
  $mail->Port = 465;
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
  $mail->SMTPAuth = true;
  $mail->Username = 'harryleggscilly@gmail.com';
  $mail->Password = 'notmypassword';
  
  $mail->CharSet = PHPMailer::CHARSET_UTF8;
  $mail->setFrom('harryleggscilly@gmail.com', (empty($name) ? 'Contact form' :$name));
  $mail->addAddress($to);
  $mail->addReplyTo($email,$name);
  $mail->Subject=$subject;
  $mail->Body=$message;
  $mail->send();
  $msg = ['status'=>200, 'message'=>'Message sent'];
  }
  catch(Exception $e){
    $msg = ['message'=>'Exception'.$e.'Mailer Error: '. $mail->ErrorInfo ];
  }
}

echo json_encode($msg);