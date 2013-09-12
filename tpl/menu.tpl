<div id="menuWrap">
	<!-- 컨텐츠 영역 -->
	<div id="menu_main"  class="contextmenu"></div>
	<!--// 컨텐츠 영역 -->
	
	<!-- 템플릿 영역 -->
	<script data-tpl="menuWrap:tpl_order" type="text/template">
		<ul class="items">
			<li class="item_0"><a href="#" data-act="orderOk:ext">종류</a></li>
			<li class="item_1"><a href="#" data-act="orderOk:name">이름</a></li>
			<li class="item_2"><a href="#" data-act="orderOk:size">크기</a></li>
			<li class="item_3"><a href="#" data-act="orderOk:date">날짜</a></li>
		</ul>
	</script>
	
	<script data-tpl="menuWrap:tpl_menu_f" type="text/template">
		<ul class="items">
			<li class="item_0"><a href="#" data-act="menuOk:d_down">직접받기</a></li>
			<li class="item_1 delimiter"><span class="">----</span></li>
			<li class="item_2"><a href="#" data-act="menuOk:l_down">링크받기</a></li>
			<li class="item_3"><a href="#" data-act="menuOk:l_show">링크보기</a></li>
			<li class="item_4 delimiter"><span class="">----</span></li>
			<li class="item_5"><a href="#" data-act="menuOk:rename">이름변경</a></li>
			<li class="item_6"><a href="#" data-act="menuOk:delete">파일삭제</a></li>
			<li class="item_7 delimiter"><span class="">----</span></li>
			<li class="item_8"><a href="#" data-act="menuOk:preview">미리보기</a></li>
		</ul>
	</script>

	<script data-tpl="menuWrap:tpl_menu_d" type="text/template">
		<ul class="items">
			<li class="item_0"><a href="#" data-act="menuOk:join">들어가기</a></li>
			<li class="item_1 delimiter"><span class="">----</span></li>
			<li class="item_2"><a href="#" data-act="menuOk:rename">이름변경</a></li>
			<li class="item_3"><a href="#" data-act="menuOk:delete">파일삭제</a></li>
		</ul>
	</script>
	<!--// 템플릿 영역 -->
</div>
