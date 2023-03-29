<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once('phpmailerexception.php');
require_once('phpmailer.php');
require_once('phpmailersmtp.php');

$mail=new PHPMailer();
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->Port = 465;
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
$mail->SMTPAuth = true;
$mail->Username = 'scillyharrylegg@gmail.com';
$mail->Password = 'loacxcliaqvpanuz';
$mail->setFrom('scillyharrylegg@gmail.com', 'Harry Legg');
$mail->addReplyTo($_POST['email'], $_POST['name']);
$mail->addAddress('harry.legg86@googlemail.com', 'Harry Legg');
$mail->Subject = 'Mail from HarryLegg.co.uk';
$mail->Body=$_POST['message'];
if(!$mail->send())
{
  echo "{error: '".$mail->ErrorInfo."'}";
}
else
{
  echo "{message: 'Your email was sent successfully'}";
}
?>
