#!/usr/bin/env sh
set -e
if ! php -r "require 'vendor/autoload.php'; \$app=require __DIR__.'/../bootstrap/app.php'; \$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap(); echo \$app['db']->connection()->getSchemaBuilder()->hasTable('sessions') ? 0 : 1;" >/dev/null; then
  php artisan migrate --force
fi
exec php-fpm