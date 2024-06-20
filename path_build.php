<?php
$_file = ['.', '..', 'path_info.json', 'dir_info.json'];
$directory = './json';


// 1.删除原的路径信息
echo "\n";
echo 'del start!' . "\n";
delpath($directory);
echo 'del end!' . "\n";
echo "\n";
function delpath($directory)
{
    // 获取目录中的所有项
    $items = scandir($directory);
    for ($i = 0; $i < count($items); $i++) {
        $item = $items[$i];
        if ($item === '.' || $item === '..') {
            continue;
        }
        // 构建完整的路径
        $fullPath = $directory . '/' . $item;
        if (is_file($fullPath)) {
            if (basename($fullPath) == 'path_info.json') {
                unlink($fullPath);
                echo $fullPath . '    del path_info.json' . "\n";
            } else if (basename($fullPath) == 'dir_info.json') {
                echo 'del dir_info.json    ' . $fullPath .  "\n";
                unlink($fullPath);
            }
        } else if (is_dir($fullPath)) {
            delpath($fullPath);
        }
    }
};


// 2.生成目录信息
// 存储目录信息的数组
$folderInfos = [];
// 获取目录中的所有项
$items = scandir($directory);
// 遍历目录中的每一项
foreach ($items as $item) {
    // 跳过"."和".."这两个特殊项
    if ($item === '.' || $item === '..') {
        continue;
    }
    // 构建完整的路径
    $fullPath = $directory . '/' . $item;
    // 检查是否为目录并且是否为排除列表
    if (is_dir($fullPath)) {
        // 获取并存储目录信息
        $folderInfo = [
            'name' => $item,
            'path' => $fullPath
        ];
        $folderInfos[] = $folderInfo;
    }
}
// 将目录信息转换为JSON格式
$jsonContent = json_encode($folderInfos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
// 指定TXT文件的保存路径和名称
$txtFilePath = $directory . '/dir_info.json';
// 将JSON内容写入TXT文件
if (file_put_contents($txtFilePath, $jsonContent) !== false) {
    // echo $jsonContent;
    echo "目录信息已成功保存到：   " . $txtFilePath .  "\n\n";
} else {
    echo "保存文件时发生错误";
}

// 3.具体信息

$json = [];
$file_count = 0;
$dir_count = 0;

echo "目标路径：  " . $directory . "\n\n";
// 获取目录中的所有项
$items = scandir($directory);
// 遍历目录中的每一项
foreach ($items as $item) {
    // 跳过"."和".."这两个特殊项
    if ($item === '.' || $item === '..') {
        continue;
    }
    // 构建完整的路径
    $fullPath = $directory . '/' . $item;
    // 检查是否为目录
    if (is_dir($fullPath)) {
        global $json;
        $json = [];
        path2json($fullPath, $json);
        $path_info_str = 'path_info.json';
        file_put_contents($fullPath . '/' . $path_info_str, json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    } else if (is_file($fullPath) && isJsonFile($fullPath)) {
        /*         echo $fullPath."\n";
        // echo "非目录\n";
        addJson($item, $fullPath); */
    }
}


function path2json($dir, $json)
{
    global $_file;
    global $json;
    global $file_count;
    global $dir_count;
    $items = scandir($dir);
    $items = array_values(array_diff($items, $_file));

    for ($i = 0; $i < count($items); $i++) {
        $item = $items[$i];
        $name = $item;
        $newitem = $dir . '/' . $item;
        $path = $newitem;
        if (is_dir($newitem)) {
            // $dir_count++;
            if (isAllJson($newitem)) {
                // echo $newitem, "目录里面全部是json文件\n";
            } else {
                // echo $newitem, "目录包含文件和目录\n";
                // $is_original = false;
                path2json($newitem, $json);
            }
        } else if (is_file($newitem) && isJsonFile($newitem)) {
            // $file_count++;
            // echo $newitem, "文件\n";
            // var_dump($path);
            addJson($name, $path);
        } else {
            // echo $newitem, "\?\n";
        }
    }
}



function isAllJson($dir)
{
    global $_file;
    global $json;
    $items = scandir($dir);
    $items = array_values(array_diff($items, $_file));
    $name = basename($dir);
    $path = array();
    $dir_children = 0;

    // 排除文件夹
    foreach ($items as $item) {
        $dir_children++;
        $newitem = $dir . '/' . $item;
        // 是否为文件夹或者非json文件
        if (is_dir($newitem)) {
            return false;
        }
    }
    // 排除空目录或者目录下面的大于6个的json文件为不同章节
    if ($dir_children == 0 || $dir_children > 6) {
        return false;
    }

    for ($i = 0; $i < count($items); $i++) {
        $item = $items[$i];
        $newitem = $dir . '/' . $item;
        if (is_file($newitem) && isJsonFile($newitem)) {
            $path[] = $newitem;
        } else {
        }
    }
    if ($name != '' && $path != '' && $path != []) {
        // var_dump($path);
        addJson($name, $path);
    }

    return true;
}

function addJson($name, $path)
{
    if (!is_array($path)) {
        $path = array($path);
    }
    global $json;
    $json[] = array(
        'name' => $name,
        'path' => $path
    );
}
function isJsonFile($filePath)
{
    // 获取文件路径的后缀名
    $fileExtension = pathinfo($filePath, PATHINFO_EXTENSION);
    // echo '' . $fileExtension . "\n";
    // 检查后缀名是否为'json'
    if (strtolower($fileExtension) == 'json') {
        return true;
    } else {
        return false;
    }
}
