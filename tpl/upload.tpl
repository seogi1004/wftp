<div id="uploadWrap" class="popup UploaderForHTML5">
	<h3 class="ir">HTML5 업로드</h3>
	<div class="wrap">
	    <div class="select_wrap">
	        <input type="file" data-act="selectedFiles#change" data-tag="selfiles" multiple="multiple">
	        <span class="pos">올릴위치</span> <span class="folder_name folder" data-bind="folderName"></span> 
	        <button class="btn_add_file"><span>파일추가</span></button>
	        <!--
	        <button id="btnPath" class="btn_path"><span>위치변경</span></button>
	        -->
	    </div>
	    <div class="file_wrap" id="fileWrap">
	        <table class="list_header" border="0" cellpadding="0" cellspacing="0" ondrag="return false;" onselect="return false;">
	            <thead>
	                <tr>
	                    <th class="no_left_line filename">이름</th>
	                    <th class="packet">전송량</th>
	                    <th class="filestatus">상태</th>
	                </tr>
	            </thead>
	        </table>
	        <div id="uplist" class="list_contents_wrap">
	           	<table border="0" cellpadding="0" cellspacing="0" class="list_contents">
					<tbody data-tpl="tpl_uplist">
					    <!-- TPL -->
					</tbody>
				</table>
				
				<!-- 파일 업로드 리스트 -->
				<script data-tpl="uploadWrap:tpl_uplist" type="text/template">
					<% for(var i in items) { %>
				    <tr>
						<td class="upload_name">
							<div title="<%= items[i].name %>">
								<span class="ext ir ext_<%= items[i].t_ext %>_<%= items[i].ext %>">file</span>
								<span class="name"><%= items[i].name %></span>
							</div>
						</td>
						<td class="packet">
							<span data-bind="fileDown:<%= i %>">0</span>/<%= items[i].u_size %>
						</td>
						<td class="filestatus">
							<span>
								<span class="upload_wait" data-bind="fileWait:<%= i %>">대기 중</span>
							</span>
						</td>
						<td class="del">
							<button class="btn_del2 ir" data-act="fileDelete:<%= items[i].index %>" data-tag="fileDelBut:<%= i %>">
								<span>삭제하기</span>
							</button>
						</td>
					</tr>
					<% } %>
				</script>
	        </div>
	        <div class="empty_wrap" data-tag="holder">
	            <div class="drag_me">마우스로 <span>파일</span>을 직접 끌어다 놓을 수 있습니다.</div>
	            <ul class="size_info">
	                <li><span>&nbsp;</span>파일 한 개당 최대 크기는 <font data-bind="fileMaxSize">50</font>MB입니다.</li>
	                <li><span>&nbsp;</span>디렉토리 업로드 기능은 구현되어 있지 않습니다.</li>
	            </ul>
	        </div>
	    </div>
	    <div class="info_wrap">
	        <div id="uploaderGauge" class="gauge_wrap"><div class="j_gaugebar" style="overflow: hidden; "><div class="j_gauge_infoarea" data-bind="sendPercent">0%</div><div class="j_gauge" style="width: 0px;" data-bind="barPercent#width"><div class="j_gauge_infoarea_shadow" data-bind="sendPercent">0%</div></div></div></div>
	        <div class="alert_wrap" id="uploaderAlert" style="display:none;">
	            용량이 <span class="bold" id="uploaderAlertCnt"></span> 부족합니다. 목록에서 파일을 삭제해주세요.
	        </div>
	        <div class="status_wrap">
	        파일 : <span class="bold" data-bind="currCnt">0</span>/<span data-bind="totalCnt">0</span>&nbsp;&nbsp;&nbsp;&nbsp;
	        용량 : <span class="bold" data-bind="currSize">0MB</span>/<span data-bind="totalSize">0MB</span>&nbsp;&nbsp;&nbsp;&nbsp;
	        시간 : <span class="bold" data-bind="currTime">0초</span><!--/<span id="totalTime">0초</span>-->
	        </div>
	    </div>
	    <div class="btn_wrap">
	        <input type="checkbox" class="fl" data-tag="closeComplete"><label for="closeComplete" class="fl">올리기 완료시 이 창을 닫음</label>
	        <button class="btn_transfer disable" data-act="sendFiles" data-tag="transfer"><span>전송시작</span></button>
	    </div>
	</div>
	
	<div class="bottom_line"></div>
	<button class="btn_close" data-act="close"><span>닫기</span></button>
	
	<span id="fileck">
		<!-- 중복 파일 안내 팝업 -->
		<div class="popup Duplication popup_dupl" data-tpl="tpl_dupl" data-tag="dupl"></div>
		
		<!-- 중복 파일 안내 팝업, 이름 변경 -->
		<div class="popup DialogBox confirm layer_change_name popup_dupl_rename" data-tpl="tpl_rename" data-tag="rename"></div>
	
		<!-- 중복 파일 안내 팝업 -->
		<script data-tpl="uploadWrap:tpl_dupl" type="text/template">
			<div class="msg_wrap2">
		    	<span>"<%= fileName %>"</span> 파일이<br>이 위치에 이미 있습니다.
			</div>
			<div class="info_wrap">
			    <table border="0" cellpadding="0" cellspacing="0">
			        <tbody>
			            <tr>
			                <th>기존 파일</th>
			                <td class="date"><%= fileOldDate %></td>
			                <td class="size"><%= fileOldSize %></td>
			            </tr>
			            <tr>
			                <th>신규 파일</th>
			                <td class="date"><%= fileNewDate %></td>
			                <td class="size"><%= fileNewSize %></td>
			            </tr>
			        </tbody>
			    </table>
			</div>
			<div class="apply_wrap">
			    <label for="chkAllApply"><input type="checkbox" data-tag="checkall" data-act="checkAll:<%= fileIndex %>"> 모든 파일에 적용</label>
			</div>
			<div class="btn_wrap2">
			    <button class="btn_overwrite" data-act="btnOverWrite:<%= fileIndex %>"><span>덮어쓰기</span></button>
			    <button class="btn_pass" data-act="btnPass:<%= fileIndex %>"><span>건너뛰기</span></button>
			    <button class="btn_change_name" data-act="btnChangeName:<%= fileIndex %>"><span>이름변경</span></button>
			    <button class="btn_stop_upload" data-act="btnStopUpload:<%= fileIndex %>"><span>전송중단</span></button>
			</div>
		</script>
		
		<!-- 중복 파일 안내 팝업, 이름 변경 -->
		<script data-tpl="uploadWrap:tpl_rename" type="text/template">
			<div class="wrap_layer_popup">
			    <div class="wrap_cont">
			        <div class="area_msg">
			            <span>이름변경하기</span><br><input data-tag="rename_txt" type="text" class="lyc txt1" value="<%= fileName %>">
			        </div><!-- // area_body -->
			        <div class="area_foot">
			            <button class="btn_layer btn_ok" data-act="btnChangeNameOk:<%= fileIndex %>"><span>확인</span></button>
			            <button class="btn_layer btn_cancel" data-act="btnChangeNameCancel:<%= fileIndex %>"><span>취소</span></button>
			        </div><!-- // area_foot -->
			        <!--
			        <a href="javascript:;" class="type_btn btn_layer btn_close" id="closeDialogBtn">닫기</a>
			        -->
			    </div>
			</div>
		</script>
	</span>
</div>