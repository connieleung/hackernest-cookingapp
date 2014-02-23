<?php

$filename = $argv[1];
$file = fopen($filename, 'r');
$ax = $ay = $az = $gx = $gy = $gz = array();

while (($data = fgetcsv($file)) !== FALSE) {
    var_dump($data);
    if (count($data) >= 7) {
        $ax[] = $data[2];
        $ay[] = $data[3];
        $az[] = $data[4];
        $gx[] = $data[5];
        $gy[] = $data[6];
        $gz[] = $data[7];
    }
}
fclose($file);
array_shift($ax);
array_shift($ay);
array_shift($az);
array_shift($gx);
array_shift($gy);
array_shift($gz);
$output = 'ax: [' . implode(',', $ax) . "],\n";
$output .= 'ay: [' . implode(',', $ay) . "],\n";
$output .= 'az: [' . implode(',', $az) . "],\n";
$output .= 'gx: [' . implode(',', $gx) . "],\n";
$output .= 'gy: [' . implode(',', $gy) . "],\n";
$output .= 'gz: [' . implode(',', $gz) . "],\n";
file_put_contents($filename . '.txt', $output);