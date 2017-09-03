module Msgs exposing (..)

import Models exposing (Tweet)
import Navigation exposing (Location)


-- MESSAGES


type Msg
    = NoOp
    | AddTweets (List Tweet)
    | OnLocationChange Location

