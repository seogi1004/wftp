<div id="wrapMinidaum">
	<div id="minidaum">
		<div class="minidaum_gnb">
			<div id="minidaumService">
				<ul class="minidaum_service_list">
					<li class="minidaum_shopping">
						<a href="#" data-act="ftpAdd">추가</a> 
					</li>
					<li class="minidaum_shopping">
						<a>|</a> 
					</li>
				</ul>
				<a href="#" id="minidaumMore" data-act="ftpList">즐겨찾기</a>
			</div>
			<div id="minidaumMoreLayer" class="minidaum_layer" data-tag="ftp_view">
				<ul class="minidaum_list_group minidaum_list_group1" data-tpl="ftpList1"></ul>
				<ul class="minidaum_list_group minidaum_list_group2" data-tpl="ftpList2"></ul>
			</div>
		</div>
	</div>
</div>

<script id="ftpList1" type="text/template">
	<% for(var i in items) { %>
	<li>
		<a href="#" data-act="<%= items[i].name %>:ftpConn"><%= items[i].name %></a>
		<button class="btn_del2" data-act="<%= items[i].name %>:ftpDel"><span>삭제하기</span></button>
	</li>
	<% } %>
</script>

<script id="ftpList2" type="text/template">
	<% for(var i in items) { %>
	<li>
		<a href="#" data-act="<%= items[i].name %>:ftpConn"><%= items[i].name %></a>
		<button class="btn_del2" data-act="<%= items[i].name %>:ftpDel"><span>삭제하기</span></button>
	</li>
	<% } %>
</script>