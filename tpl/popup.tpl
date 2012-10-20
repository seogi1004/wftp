<div id="popupWrap">
	<!-- 블라인드 영역 -->
	<div class="blinder" data-tag="blinder"></div>
	
	<!-- 컨텐츠 영역 -->
	<div id="popup_main" class="popup DialogBox confirm popup_confirm"></div>
	
	<!-- 템플릿 영역 -->
	<script id="tpl_auth" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont popup_font">
		        <div class="area_head">
		        	<h2>Ftp Information</h2>
		        </div>
		        <div class="area_msg">
		        	<table>
		        		<tr><td><label>Ftp Name</label></td><td><input type="text" data-tag="input:name"/></td></tr>
		        		<tr><td><label>Host Address</label></td><td><input type="text" data-tag="input:host"/></td></tr>
		        		<tr><td><label>User ID</label></td><td><input type="text" data-tag="input:user"/></td></tr>
		        		<tr><td><label>Passward</label></td><td><input type="password" data-tag="input:passwd"/></td></tr>
		        		<tr><td><label>Default Path</label></td><td><input type="text" data-tag="input:d_path"/></td></tr>
		        		<tr><td><label>Ftp Url</label></td><td><input type="text" data-tag="input:url"/></td></tr>
		        	</table>
		        </div>
		        <div class="area_foot">
		            <button class="btn_layer btn_ok" data-act="authOk"><span>확인</span></button>
		            <button class="btn_layer btn_cancel" data-act="commonCancel"><span>취소</span></button>
		        </div>
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>
	
	<script id="tpl_img" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont popup_font">
		        <div class="area_head">
		        	<h2>Image Preview<small> - <%= down %><% if(isLink) { %>/<a href="#" data-act="showLink:<%= name %>">link</a><% } %></small></h2>
		        	<!--
		        	<h2>Image Preview<% if(url) { %><small> - <a href="<%= url %>" target="_blank">Link</a></small><% } %></h2>
		        	-->
		        </div>
		        <div class="area_msg">
		        	<img src="data:image/<%= ext %>;base64,<%= data %>"/>
		        </div>
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>
	
	<script id="tpl_doc" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont popup_font">
		        <div class="area_head">
		        	<h2>Syntax Preview<small> - <%= down %><% if(isLink) { %>/<a href="#" data-act="showLink:<%= name %>">link</a><% } %></small></h2>
		        	<!--
		        	<h2>Syntax Preview<% if(url) { %><small> - <a href="<%= url %>" target="_blank">Link</a></small><% } %></h2>
		        	-->
		        </div>
		        <div class="area_msg">
		        	<iframe id="document" src="preview.html"></iframe>
		        </div>
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>
	
	<script id="tpl_noti" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont popup_font">
		        <div class="area_head">
		        	<h2>Notice</h2>
		        </div>
		        <div id="notice" class="area_msg">
		        	<%= notice %>
		        </div>
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>
		
	<script id="tpl_del" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont">
		        <div class="area_msg">
		            <p class="msg">"<span>선택한 파일</span>"(을)를 삭제하시겠습니까?</p><p class="msg_info">삭제한 파일은 복구할 수 없습니다.</p>
		        </div><!-- // area_body -->
		        <div class="area_foot">
		            <button class="btn_layer btn_ok" data-act="delOk"><span>확인</span></button>
		            <button class="btn_layer btn_cancel" data-act="commonCancel"><span>취소</span></button>
		        </div><!-- // area_foot -->
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>
	
	<script id="tpl_alert" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont">
		        <div class="area_msg">
		            <p class="msg"><%= msg %></p>
		        </div><!-- // area_body -->
		        <div class="area_foot">
		            <button class="btn_layer btn_ok" data-act="commonCancel"><span>확인</span></button>
		        </div><!-- // area_foot -->
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>

	<script id="tpl_confirm" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont">
		        <div class="area_msg">
		            <span><%= title %></span><br><br>
		            <input data-tag="confirm_text" data-act="confirmOkEnter#keyup" type="text" class="lyc txt1" value="<%= text %>" />
		        </div><!-- // area_body -->
		        <div class="area_foot">
		            <button class="btn_layer btn_ok" data-act="confirmOk"><span>확인</span></button>
		            <button class="btn_layer btn_cancel" data-act="commonCancel"><span>취소</span></button>
		        </div><!-- // area_foot -->
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>
	
	<script id="tpl_link" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont">
		        <div class="area_msg">
		           <p class="msg">아래 링크를 복사해주세요.</p>
		           <p class="msg_info"><input data-tag="link_txt" type="text" class="lyc txt1 link" value="<%= link %>" /></p>
		        </div><!-- // area_body -->
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>

	<script id="tpl_download" type="text/template">
		<div class="wrap_layer_popup">
		    <div class="wrap_cont">
		        <div class="area_msg">
		           <p class="msg" data-bind="download"><span class="loading">&nbsp;&nbsp;&nbsp;</span> 다운로드 준비 중입니다.</p>
		        </div><!-- // area_body -->
		        <a class="type_btn btn_layer btn_close" data-act="commonCancel">닫기</a>
		    </div>
		</div>
	</script>
	
	<!--// 템플릿 영역 -->
</div>
