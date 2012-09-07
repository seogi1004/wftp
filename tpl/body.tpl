<!-- 네비게이터 메뉴 -->
<div id="leftWrap" data-bind="line" data-css="width"></div>

<div id="leftFlexBar" data-tag="bar" data-bind="bar" data-css="left">
	<div class="btn_bar"></div>
</div>
<hr>

<!-- FTP 파일 목록 -->
<div id="mainWrap" data-bind="line" data-css="margin-left"></div><hr>

<!-- 템플릿 로드 하는 부분 -->
<script>_.importTpl("leftWrap:body_left", "mainWrap:body_main");</script>	