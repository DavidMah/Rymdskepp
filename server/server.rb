load 'socket_server.rb'
load 'game_server.rb'
fork {
  run_socket_server
}
sleep 2
run_game_server
