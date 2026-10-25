<?php
declare(strict_types=1);

function respondJson(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');

    $response = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    echo $response === false ? '{"success":false,"message":"Terjadi kesalahan saat memproses permintaan."}' : $response;
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'POST') {
    $name = isset($_POST['name']) && is_string($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) && is_string($_POST['email']) ? trim($_POST['email']) : '';
    $service = isset($_POST['service']) && is_string($_POST['service']) ? trim($_POST['service']) : '';
    $message = isset($_POST['message']) && is_string($_POST['message']) ? trim($_POST['message']) : '';

    $allowedServices = [
        'Logo & Identitas Brand',
        'Poster Promosi',
        'Banner & Spanduk',
        'Kemasan & Label Produk',
        'Konten Visual Media Sosial',
    ];

    if (
        $name === '' || strlen($name) > 100 ||
        filter_var($email, FILTER_VALIDATE_EMAIL) === false || strlen($email) > 254 ||
        !in_array($service, $allowedServices, true) ||
        $message === '' || strlen($message) > 5000
    ) {
        respondJson(422, [
            'success' => false,
            'message' => 'Periksa kembali nama, email, layanan, dan pesan Anda.',
        ]);
    }

    $dataDirectory = __DIR__ . DIRECTORY_SEPARATOR . 'data';
    if (!is_dir($dataDirectory) && !mkdir($dataDirectory, 0700, true) && !is_dir($dataDirectory)) {
        respondJson(500, [
            'success' => false,
            'message' => 'Pesan belum dapat disimpan. Silakan hubungi kami melalui WhatsApp.',
        ]);
    }

    $inquiry = json_encode([
        'received_at' => date(DATE_ATOM),
        'name' => $name,
        'email' => $email,
        'service' => $service,
        'message' => $message,
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

    if ($inquiry === false) {
        respondJson(500, [
            'success' => false,
            'message' => 'Pesan belum dapat diproses. Silakan coba lagi.',
        ]);
    }

    $inboxPath = $dataDirectory . DIRECTORY_SEPARATOR . 'inquiries.jsonl';
    $inbox = fopen($inboxPath, 'ab');
    if ($inbox === false) {
        respondJson(500, [
            'success' => false,
            'message' => 'Pesan belum dapat disimpan. Silakan hubungi kami melalui WhatsApp.',
        ]);
    }

    $locked = flock($inbox, LOCK_EX);
    $line = $inquiry . PHP_EOL;
    $written = $locked ? fwrite($inbox, $line) : false;
    $flushed = $locked ? fflush($inbox) : false;
    if ($locked) {
        flock($inbox, LOCK_UN);
    }
    fclose($inbox);

    if ($written === false || $written !== strlen($line) || !$flushed) {
        respondJson(500, [
            'success' => false,
            'message' => 'Pesan belum dapat disimpan. Silakan hubungi kami melalui WhatsApp.',
        ]);
    }

    respondJson(200, [
        'success' => true,
        'message' => 'Terima kasih, ' . $name . '! Pesan Anda sudah diterima tim Karta Studio.',
    ]);
}

if ($method !== 'GET') {
    header('Allow: GET, POST');
    respondJson(405, [
        'success' => false,
        'message' => 'Metode permintaan tidak didukung.',
    ]);
}

$pagePath = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'index.html';
$page = file_get_contents($pagePath);
if ($page === false) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Halaman portofolio tidak dapat dimuat.';
    exit;
}

$page = str_replace('<head>', "<head>\n    <base href=\"../\">", $page, $baseTagCount);
if ($baseTagCount !== 1) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Konfigurasi halaman portofolio tidak valid.';
    exit;
}

header('Content-Type: text/html; charset=utf-8');
echo $page;