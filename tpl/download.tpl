<div id="downloadWrap" class="popup UploaderForHTML5">
	<h3 class="ir">HTML5 다운로드</h3>
	<div class="wrap">
	    <div class="select_wrap">
	        <span class="pos">받을위치</span> <span class="folder_name folder" data-bind="folderName"></span> 
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
	        <div id="downlist" class="list_contents_wrap">
	           	<table border="0" cellpadding="0" cellspacing="0" class="list_contents">
					<tbody data-tpl="tpl_downlist">
					    <!-- TPL -->
					</tbody>
				</table>
				
				<!-- 파일 다운로드 리스트 -->
				<script id="tpl_downlist" type="text/template">
					<% for(var i in items) { %>
				    <tr>
						<td class="upload_name">
							<div title="<%= items[i].name %>">
								<span class="ext ir ext_<%= items[i].t_ext %>_<%= items[i].ext %>">file</span>
								<span class="name"><%= decodeURIComponent(items[i].name) %></span>
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
	    </div>
	    <div class="info_wrap">
	        <div id="uploaderGauge" class="gauge_wrap"><div class="j_gaugebar" style="overflow: hidden; "><div class="j_gauge_infoarea" data-bind="downPercent">0%</div><div class="j_gauge" style="width: 0px;" data-bind="barPercent#width"><div class="j_gauge_infoarea_shadow" data-bind="downPercent">0%</div></div></div></div>
	        <div class="status_wrap">
	        파일 : <span class="bold" data-bind="currCnt">0</span>/<span data-bind="totalCnt">0</span>&nbsp;&nbsp;&nbsp;&nbsp;
	        용량 : <span class="bold" data-bind="currSize">0MB</span>/<span data-bind="totalSize">0MB</span>&nbsp;&nbsp;&nbsp;&nbsp;
	        시간 : <span class="bold" data-bind="currTime">0초</span><!--/<span id="totalTime">0초</span>-->
	        </div>
	    </div>
	    <div class="btn_wrap">
	        <button class="btn_transfer disable" data-act="downFiles" data-tag="transfer"><span>받기시작</span></button>
	    </div>
	</div>
	
	<div class="bottom_line"></div>
	<button class="btn_close" data-act="close"><span>닫기</span></button>
