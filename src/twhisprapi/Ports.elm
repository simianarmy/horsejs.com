port module Ports exposing (..)

import Models exposing (ApiResponse, QueryOpts)

-- ports for sending to js
port results : ApiResponse -> Cmd msg

-- port for listening for data from JavaScript
port getTweet : (String -> msg) -> Sub msg
port getMore : (QueryOpts -> msg) -> Sub msg
port getRandom : (QueryOpts -> msg) -> Sub msg


