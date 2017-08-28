port module Ports exposing (..)

import Models exposing (Tweet)

-- ports for incoming data
port addTweets: (List Tweet -> msg) -> Sub msg
