<?php
require_once('able/$');

switch($_GET['job']) {
  default:
  case 'inventory':
    $cron = new CronJob\Scraper;
    break;
  case 'returns':
    $cron = new CronJob\Returns;
    break;
  case 'sales':
    $cron = new CronJob\Sales;
    break;
}

echo $cron->Output();
?>
