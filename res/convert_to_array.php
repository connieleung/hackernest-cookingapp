<?php

$filename = $argv[1];
$file = fopen($filename, 'r');
$accel_x = $accel_y = $accel_z = array();
while (($data = fgetcsv($file)) !== FALSE) {
    if (count($data) > 4) {
        $accel_x[] = $data[2];
        $accel_y[] = $data[3];
        $accel_z[] = $data[4];
    }
}
fclose($file);
array_shift($accel_x);
array_shift($accel_y);
array_shift($accel_z);
$output = 'ax: [' . implode(',', $accel_x) . "],\n";
$output .= 'ay: [' . implode(',', $accel_y) . "],\n";
$output .= 'az: [' . implode(',', $accel_z) . "],\n";
file_put_contents($filename . '.txt', $output);