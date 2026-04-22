<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Buat request internal ke AdminTalentController
$controller = new \App\Http\Controllers\Admin\AdminTalentController();
try {
    $response = $controller->show(34);
    echo "=== RESPONSE ===\n";
    echo json_encode(json_decode($response->getContent()), JSON_PRETTY_PRINT);
} catch (\Exception $e) {
    echo "=== ERROR ===\n";
    echo $e->getMessage();
}
