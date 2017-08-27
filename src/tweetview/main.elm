module TweetView exposing (..)

import Html exposing (Html, program, div, text, program, article)
import Html.Attributes as HA exposing (id)
import Msgs exposing (Msg)
import Models exposing (Model, initialModel)
--import Update exposing (update)
import TweetText.Article

-- MODEL

init : ( Model, Cmd Msg )
init =
    ( Model.initialModel, Cmd.none )


-- VIEW


view : Model -> Html Msg
view model =
    div []
    [ page model ]

page : Model -> Html Msg
page model =
    TweetText.Article.view model


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


-- MAIN


main : Program Never Model Msg
main =
    program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

