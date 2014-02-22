<?php

$filename = $argv[1];
$file = fopen($filename, 'r');
$accel_x = $accel_y = $accel_z = $g_x = $g_y = $g_z = array();
while (($data = fgetcsv($file)) !== FALSE) {
    if (count($data) > 7) {
        $accel_x[] = $data[2];
        $accel_y[] = $data[3];
        $accel_z[] = $data[4];
        $g_x[] = $data[5];
        $g_y[] = $data[6];
        $g_z[] = $data[7];
    }
}
fclose($file);
array_shift($accel_x);
array_shift($accel_y);
array_shift($accel_z);
array_shift($g_x);
array_shift($g_y);
array_shift($g_z);
$output = 'ax: [' . implode(',', $accel_x) . "],\n";
$output .= 'ay: [' . implode(',', $accel_y) . "],\n";
$output .= 'az: [' . implode(',', $accel_z) . "],\n";
$output .= 'gx: [' . implode(',', $g_x) . "],\n";
$output .= 'gy: [' . implode(',', $g_y) . "],\n";
$output .= 'gz: [' . implode(',', $g_z) . "],\n";
file_put_contents($filename . '.txt', $output);