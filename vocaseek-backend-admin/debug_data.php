<?php
require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Test apakah admin models bisa query dengan benar
$userId = 34;

echo "=== TEST DENGAN USER_ID=$userId ===\n\n";

// 1. Cari user
$user = \App\Models\User::find($userId);
echo "User via find($userId): " . ($user ? $user->nama : 'null') . "\n";

$user2 = \App\Models\User::where('user_id', $userId)->first();
echo "User via where(user_id): " . ($user2 ? $user2->nama : 'null') . "\n";

if ($user) {
    echo "\n--- Relasi Experiences ---\n";
    $exps = $user->experiences;
    echo "Count: " . $exps->count() . "\n";
    foreach ($exps as $e) {
        echo "  [{$e->id}] {$e->title} @ {$e->company}\n";
    }

    echo "\n--- Relasi Certifications ---\n";
    $certs = $user->certifications;
    echo "Count: " . $certs->count() . "\n";
    foreach ($certs as $c) {
        echo "  [{$c->id}] {$c->name}\n";
    }

    echo "\n--- InternProfile ---\n";
    $p = $user->internProfile;
    echo "Profile: " . ($p ? "ADA" : "NULL") . "\n";
    if ($p) {
        echo "test_started_at: {$p->test_started_at}\n";
        echo "test_finished_at: {$p->test_finished_at}\n";
    }

    echo "\n--- TestAnswers ---\n";
    $answers = \App\Models\TestAnswer::where('user_id', $userId)->get();
    echo "Count: " . $answers->count() . "\n";
    foreach ($answers->take(3) as $a) {
        echo "  [{$a->id}] {$a->question_text} => {$a->user_answer}\n";
    }
}

// Cek tabel yang digunakan oleh model
$expModel = new \App\Models\InternExperience();
echo "\n--- Model Table Names ---\n";
echo "InternExperience table: " . $expModel->getTable() . "\n";
$certModel = new \App\Models\InternCertification();
echo "InternCertification table: " . $certModel->getTable() . "\n";
$taModel = new \App\Models\TestAnswer();
echo "TestAnswer table: " . $taModel->getTable() . "\n";
