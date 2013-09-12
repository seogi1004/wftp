<?php
	$args = array(
		"host"=>$_REQUEST['host'],
		"user"=>$_REQUEST['user'],
		"passwd"=>$_REQUEST['passwd'],
		"d_path"=>$_REQUEST['d_path'],
		"path"=>$_REQUEST['path'],
		"data"=>$_REQUEST['code']
	);
	
	require( __DIR__ . '/php/Client.php');
	use ElephantIO\Client as ElephantIOClient;
	
	$elephant = new ElephantIOClient('http://inpost.kr:1340', 'socket.io', 1, false, true, true);
	
	$elephant->init();
	$elephant->send(
	    ElephantIOClient::TYPE_EVENT,
	    null,
	    null,
	    json_encode(array('name'=>'auth', 'args'=>array($args)))
	);
	$elephant->send(
	    ElephantIOClient::TYPE_EVENT,
	    null,
	    null,
	    json_encode(array('name'=>'write', 'args'=>array($args)))
	);
	$elephant->close();
	
	echo 'tryin to send `foo` to the event called action';
?>