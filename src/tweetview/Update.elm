module Update exposing (..)

import Array exposing (Array)

import Msgs exposing (Msg)
import Models exposing (Model)

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        Msgs.NoOp -> (model, Cmd.none)
        Msgs.NewTweets tweets ->
            ({ model | tweets = Array.fromList tweets }, Cmd.none)
