<?php
// ================= SECURITY CHECK =================
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: index.html");
    exit();
}

// ================= FETCH & SANITIZE =================
$fullname    = htmlspecialchars(trim($_POST['fullname'] ?? ''), ENT_QUOTES, 'UTF-8');
$phone       = htmlspecialchars(trim($_POST['phone'] ?? ''), ENT_QUOTES, 'UTF-8');
$email       = htmlspecialchars(trim($_POST['email'] ?? ''), ENT_QUOTES, 'UTF-8');
$pickup      = htmlspecialchars(trim($_POST['pickup'] ?? ''), ENT_QUOTES, 'UTF-8');
$destination = htmlspecialchars(trim($_POST['destination'] ?? ''), ENT_QUOTES, 'UTF-8');
$date        = htmlspecialchars(trim($_POST['date'] ?? ''), ENT_QUOTES, 'UTF-8');
$passengers  = htmlspecialchars(trim($_POST['passengers'] ?? ''), ENT_QUOTES, 'UTF-8');
$message     = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

// ================= VALIDATION =================
if ($phone === '') {
    echo "Phone number is required.";
    exit();
}

// ================= EMAIL SETTINGS =================
$to = "caravanindelhi@gmail.com";
$subject = "New Caravan Inquiry - CaravanInDelhi.com";

// Use a no-reply email from the domain (standard practice to avoid spam filters)
$fromEmail = "no-reply@caravanindelhi.com";
$fromName  = "Caravan In Delhi - Enquiry System";

// ================= EMAIL BODY =================
$mailBody = "
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; padding: 20px; }
    .container { background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
    h2 { color: #c9a34e; border-bottom: 2px solid #c9a34e; padding-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .label { font-weight: bold; color: #555; width: 35%; }
    .value { color: #000; }
    .footer { margin-top: 30px; font-size: 12px; color: #888; text-align: center; }
  </style>
</head>
<body>

<div class='container'>
  <h2>🚐 New Lead Received</h2>
  <p>You have received a new enquiry from the website:</p>

  <table>";

if ($fullname) $mailBody .= "<tr><td class='label'>Name</td><td class='value'>{$fullname}</td></tr>";
$mailBody .= "<tr><td class='label'>Phone</td><td class='value'>{$phone}</td></tr>";
if ($email)    $mailBody .= "<tr><td class='label'>Email</td><td class='value'>{$email}</td></tr>";
if ($pickup)   $mailBody .= "<tr><td class='label'>Pick-up From</td><td class='value'>{$pickup}</td></tr>";
if ($destination) $mailBody .= "<tr><td class='label'>Traveling To</td><td class='value'>{$destination}</td></tr>";
if ($date)     $mailBody .= "<tr><td class='label'>Travel Date</td><td class='value'>{$date}</td></tr>";
if ($passengers) $mailBody .= "<tr><td class='label'>Passengers</td><td class='value'>{$passengers}</td></tr>";
if ($message)  $mailBody .= "<tr><td class='label'>Message</td><td class='value'>{$message}</td></tr>";

$mailBody .= "
  </table>

  <div class='footer'>
    <p>This email was sent from the booking form on <strong>caravanindelhi.com</strong></p>
  </div>
</div>

</body>
</html>
";

// ================= HEADERS =================
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: {$fromName} <{$fromEmail}>\r\n";
$headers .= "Reply-To: " . ($email ? $email : $fromEmail) . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// ================= SEND MAIL =================
if (mail($to, $subject, $mailBody, $headers)) {
    header("Location: thank-you.html");
    exit();
} else {
    echo "<h3>Mail sending failed. Please contact administrator at caravanindelhi@gmail.com</h3>";
}
?>