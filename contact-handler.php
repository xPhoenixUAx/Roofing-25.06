<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'message' => 'Method not allowed.']);
    exit;
}

function field(string $key, int $limit = 1200): string
{
    $value = isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
    $value = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value) ?? '';
    return substr($value, 0, $limit);
}

if (field('company', 200) !== '') {
    echo json_encode(['ok' => true, 'message' => 'Request received.']);
    exit;
}

$name = field('name', 160);
$phone = field('phone', 80);
$email = field('email', 180);
$location = field('location', 180);
$property = field('property', 120);
$urgency = field('urgency', 120);
$service = field('service', 120);
$message = field('message', 2000);

if ($name === '' || $phone === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Please complete name, phone, and project details.']);
    exit;
}

if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$submittedAt = gmdate('Y-m-d H:i:s') . ' UTC';
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

$payload = [
    'submitted_at' => $submittedAt,
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'location' => $location,
    'property' => $property,
    'urgency' => $urgency,
    'service' => $service,
    'message' => $message,
    'ip' => $ipAddress,
    'user_agent' => $userAgent,
];

$storageDir = __DIR__ . DIRECTORY_SEPARATOR . 'storage';
if (!is_dir($storageDir)) {
    @mkdir($storageDir, 0755, true);
}

$logLine = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
@file_put_contents($storageDir . DIRECTORY_SEPARATOR . 'contact-submissions.log', $logLine, FILE_APPEND | LOCK_EX);

$to = 'requests@rooflinknetwork.com';
$subject = 'New roofing provider request';
$body = "New roofing request\n\n"
    . "Submitted: {$submittedAt}\n"
    . "Name: {$name}\n"
    . "Phone: {$phone}\n"
    . "Email: " . ($email !== '' ? $email : 'Not provided') . "\n"
    . "Location: " . ($location !== '' ? $location : 'Not provided') . "\n"
    . "Property type: " . ($property !== '' ? $property : 'Not provided') . "\n"
    . "Timing: " . ($urgency !== '' ? $urgency : 'Not provided') . "\n"
    . "Service: {$service}\n\n"
    . "Project details:\n{$message}\n\n"
    . "IP: {$ipAddress}\n"
    . "User agent: {$userAgent}\n";

$headers = [
    'From: RoofLink Website <no-reply@rooflinknetwork.com>',
    'Reply-To: ' . ($email !== '' ? $email : 'no-reply@rooflinknetwork.com'),
    'Content-Type: text/plain; charset=UTF-8',
];

@mail($to, $subject, $body, implode("\r\n", $headers));

echo json_encode([
    'ok' => true,
    'message' => 'Thanks. Your roofing request was received.',
]);
