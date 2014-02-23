<html>
<head>
    <style>
        div.action { float: left; margin-left: 30px; width: 175px; }
        .count { font-weight: bold; font-size: 19px; }
    </style>
	<script src="js/socket.io.js"></script>
	<script src="js/jquery-2.1.0.min.js"></script>
	<script src="js/data.js"></script>
	<script src="js/dtw.js"></script>
<!--	<script src="js/custom.js"></script>-->
	<script src="js/index.js"></script>
	<style>
		span {
			display:block;
		}
	</style>
</head>
<body>
<div class="action">
    <h1>Knead</h1>
    <div id="knead">
        Count: <span class="count">0</span>
        Threshold: <span class="threshold"></span>
        Buffer: <span class="buffer"></span>
        Score: <span class="score"></span>
    </div>
</div>
<div class="action">
    <h1>Roll</h1>
    <div id="roll">
        Count: <span class="count">0</span>
        Threshold: <span class="threshold"></span>
        Buffer: <span class="buffer"></span>
        Score: <span class="score"></span>
    </div>
</div>
<div class="action">
    <h1>Whisk</h1>
    <div id="whisk">
        Count: <span class="count">0</span>
        Threshold: <span class="threshold"></span>
        Buffer: <span class="buffer"></span>
        Score: <span class="score"></span>
    </div>
</div>
<div class="action">
    <h1>Chop</h1>
    <div id="chop">
        Count: <span class="count">0</span>
        Threshold: <span class="threshold"></span>
        Buffer: <span class="buffer"></span>
        Score: <span class="score"></span>
    </div>
</div>
<div class="action">
    <h1>Sift</h1>
    <div id="sift">
        Count: <span class="count">0</span>
        Threshold: <span class="threshold"></span>
        Buffer: <span class="buffer"></span>
        Score: <span class="score"></span>
    </div>
</div>
</body>
</html>