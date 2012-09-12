<!-- 네비게이터 메뉴 -->
<div id="leftWrap" data-bind="line#width"></div>

<div id="leftFlexBar" data-tag="bar" data-bind="bar#left">
	<div class="btn_bar"></div>
</div>
<hr>

<!-- FTP 파일 목록 -->
<div id="mainWrap" data-bind="line#margin-left"></div><hr>

<!-- 템플릿 로드 하는 부분 -->
<script>MvvmUI.includeTpl("leftWrap:body_left", "mainWrap:body_main", { path: "tpl" });</script>	