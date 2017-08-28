module Update exposing (..)

import Array exposing (Array)

import Msgs exposing (Msg)
import Models exposing (Model)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        Msgs.NoOp -> (model, Cmd.none)
        Msgs.AddTweets tweets ->
            ({ model |
            tweets = Array.fromList tweets,
            currentIndex = 0
            }, Cmd.none)
