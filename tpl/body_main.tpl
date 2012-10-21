<div id="m_toolbar" class="contents_top">
	<h3 class="folder_title folder" data-bind="path" data-attr="title"><span data-bind="path">&nbsp;</span></h3>
	<div class="toolbar">
		<ul class="menu_bottons">
			<li>
				<input type="checkbox" name="" value="" class="daumhide">
				<button type="button" class="btn_all_select" data-act="allChecked">
					<span>전체</span>
				</button>
			</li>
			<li class="split">
				<button type="button" class="btn_download" data-act="checkedDown">
					<span>내려받기</span>
				</button>
			</li>
			<li>
				<button id="FilelistShareBtn" type="button" class="btn_share" data-act="nonDevelopMsg">
					<span>폴더공유</span>
				</button>
			</li>
			<li>
				<button type="button" class="btn_delete" data-act="deleteItem">
					<span>삭제</span>
				</button>
			</li>
		</ul>
		<ul class="menu_sub">
			<li>
				<a href="#" class="selectbox" data-act="nonDevelopMsg">보내기</a>
			</li>
			<li>
				<a href="#" class="selectbox" data-act="nonDevelopMsg">추가기능</a>
			</li>
			<li class="split">
				<a href="#" class="btn_newfolder" data-act="createDir">새폴더</a>
			</li>
		</ul>

		<!--
		<a href="#" class="view_file_type selectbox">파일별 보기</a>
		-->
		<div class="view_mode" data-bind="listtype#display">
			<span class="btn_list_view" title="리스트 보기">리스트 보기</span>
			<a class="btn_icon_view" href="#" title="미리보기" data-act="changeMode:view">미리보기</a>
		</div>
		<div class="view_mode" data-bind="viewtype#display">
			<a class="btn_list_view" href="#" title="리스트 보기" data-act="changeMode:list">리스트 보기</a>
			<span class="btn_icon_view" title="미리보기">미리보기</span>
		</div>
	</div>
</div>

<div id="m_filelist">
	<!-- 파일 목록 들어오는 영역 -->
	<span id="filelist_view"></span>
	
	<!-- 프리뷰 타입, Template -->
	<script data-tpl="m_filelist:tpl_view" type="text/template">
		<div class="icon_header">
			<div class="fl">
				<span class="fl">정렬기준&nbsp;&nbsp;:&nbsp;&nbsp;</span>
				<a href="#" class="type fl" data-bind="orderName" data-act="orderPreview">이름순</a>
	
				<span class="seperator fl">-</span>
				<a href="#" class="order fl" data-bind="orderType" data-act="changeOrder">오름차순</a>
			</div>
		</div>
		<div class="icon_contents_wrap">
			<div data-tag="viewRoot" class="icon_contents level1">
				<div class="item parent">
					<div class="image">
						<span data-act="changePath:<%= p_path %>#dblclick" class="ext_b ext_b_parent_dir ir">디렉토리</span>
					</div>
					<div class="name">
						<span title="상위폴더로 가기">..</span>
					</div>
				</div>
				
				<% for(var i in items) { %>
				<div class="item" data-index="<%= i %>" data-tag="item:<%= items[i].name %>" data-act="onlyCheckedFile">
					<div class="image">
						<% if(items[i].is_dir) { %>
						<span data-act="changePath:<%= items[i].f_path %>#dblclick" class="ext_b ir ext_b_dir">dir</span>
						<% } else { %>
						<span data-act="link:<%= items[i].name %>#dblclick" class="ext_b ir ext_<%= items[i].t_ext %>_b ext_<%= items[i].t_ext %>_<%= items[i].ext %>_b">file</span>
						<% } %>
					</div>
					<div class="info">
						<input type="checkbox" class="chk fl" name="ck_files" data-act="checkedFile:<%= i %>" data-tag="ck_files:<%= i %>">
						<a href="#" class="lyc btn_favorite_off ir fl" title="중요표시 on/off">중요표시</a>
					</div>
					<div class="name">
						<span data-act="showRenameTxt:<%= i %>#dblclick">
							<a data-tag="file_name:<%= i %>"><%= items[i].name %></a>
							<input type="text" data-act="changeName:<%= i %>#keyup" data-tag="rename_txt:<%= i %>" value="<%= items[i].name %>" class="txt1" />
						</span>
					</div>
				</div>
				<% } %>
			</div>
		</div>
	</script>
	<!--// 프리뷰 타입 -->
	
	<!-- 리스트 타입, Template -->
	<script data-tpl="m_filelist:tpl_list" type="text/template">
		<table class="list_header" border="0" cellpadding="0" cellspacing="0">
		    <thead>
		        <tr>
		            <th class="h_c_0 no_left_line">&nbsp;</th>
		            <th class="h_c_1 no_left_line"><span>중요</span></th>
		            <th class="h_c_2 kind"><a href="#" data-act="orderList:ext" data-tag="orderType:ext">종류</a></th>
		            <th class="h_c_3 name"><a href="#" data-act="orderList:name" data-tag="orderType:name">이름</a></th>
		            <th class="h_c_4 size"><a href="#" data-act="orderList:size" data-tag="orderType:size">크기</a></th>
		            <th class="h_c_5 mdate"><a href="#" data-act="orderList:date" data-tag="orderType:date">변경한 날짜</a></th>
		            <th class="h_c_6 udate">&nbsp;</th>
		        </tr>
		    </thead>
		</table>
		<div class="list_contents_wrap">
			<table border="0" cellpadding="0" cellspacing="0" class="list_contents">
				<tbody data-tag="viewRoot">
					<tr class="first">
						<td class="c_c_0"><span class="ico_folder ico_folder_parent">&nbsp;</span></td>
						<td class="c_c_1">
							<span class="parent">
								<a data-act="changePath:<%= p_path %>#dblclick">..</a>
							</span>
						</td>
			
						<td class="c_c_2">&nbsp;</td>
						<td class="c_c_3">&nbsp;</td>
						<td class="c_c_4">&nbsp;</td>
						<td class="c_c_5">&nbsp;</td>
						<td class="c_c_6">&nbsp;</td>
					</tr>
					<% for(var i in items) { %>
					<tr class="item" data-index="<%= i %>" data-tag="item:<%= items[i].name %>" data-act="onlyCheckedFile">
						<td class="c_c_0">
							<div class="continuous_wrap">
								<input type="checkbox" class="chk" name="ck_files" data-act="checkedFile:<%= i %>" data-tag="ck_files:<%= i %>">
							</div>
						</td>
						<td class="c_c_1">
							<button type="button" class="lyc btn_favorite_off">
								<span></span>
							</button>
						</td>
						<td class="c_c_2">
							<% if(items[i].is_dir) { %>
							<span class="ext ext_dir ir">폴더</span>
							<% } else { %>
							<span class="ext ir ext_<%= items[i].t_ext %> ext_<%= items[i].t_ext %>_<%= items[i].ext %>">file</span>
							<% } %>
						</td>
						<td class="c_c_3">
							<div>
								<span title="<%= items[i].name %>">
									<a href="#" data-act="showRenameTxt:<%= i %>#dblclick" title="이름변경"><img src="http://app.inpost.kr/wftp/_daum/img/btn_rename.gif" class="btn_rename" /></a>
									<% if(items[i].is_dir) { %>
									<a data-tag="file_name:<%= i %>" data-act="changePath:<%= items[i].f_path %>#dblclick"><%= items[i].name %></a>
									<% } else { %>
									<a data-tag="file_name:<%= i %>" data-act="link:<%= items[i].name %>#dblclick"><%= items[i].name %></a>
									<% } %>
									<input type="text" data-act="changeName:<%= i %>#keyup" data-tag="rename_txt:<%= i %>" value="<%= items[i].name %>" class="txt1" />
								</span>
							</div>
						</td>
						<td class="c_c_4"><%= items[i].u_size %></td>
						<td class="c_c_5"><%= items[i].date %></td>
						<td class="c_c_6">&nbsp;</td>
					</tr>
					<% } %>
				</tbody>
			</table>
		</div>
	</script>
	<!--// 리스트 타입 -->
</div>

<div id="pagingWrap" class="paging" style="display: none; "></div>
