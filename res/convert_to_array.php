<?php

$filename = $argv[1];
$file = fopen($filename, 'r');
$sumA = $sumG = array();
while (($data = fgetcsv($file)) !== FALSE) {
    var_dump($data);
    if (count($data) >= 7) {
        $sumA[] = $data[2] + $data[3] + $data[4];
        $sumG[] = $data[5] + $data[6] + $data[7];
    }
}
fclose($file);
array_shift($sumA);
array_shift($sumG);
$output = 'sumA: [' . implode(',', $sumA) . "],\n";
$output .= 'sumG: [' . implode(',', $sumG) . "],\n";
file_put_contents($filename . '.txt', $output);