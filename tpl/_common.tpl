<script id="tpl_dir" type="text/template">
	<li <% if(f_path == "_") { %>id="dirRoot"<% } %> data-dir="<%= f_path %>" data-act="changePath:<%= f_path %>">
		<span class="folder"><%= name %></span>
		<ul data-child="<%= f_path %>">
			<!-- 자식 노드 들어오는 곳 -->
		</ul>
	</li>
</script>