module Msgs exposing (..)

import Models exposing (Tweet)

-- MESSAGES


type Msg
    = NoOp
    | AddTweets (List Tweet)

