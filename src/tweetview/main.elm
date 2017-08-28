module TweetView exposing (..)

import Html exposing (Html, program, div, text, program, article)
import Array exposing (Array, get)
import Msgs exposing (Msg)
import Models exposing (Model, initialModel)
import Update exposing (update)
import TweetText.Article
import Ports exposing (addTweets)

-- MODEL

init : ( Model, Cmd Msg )
init =
    ( initialModel, Cmd.none )


-- VIEW


view : Model -> Html Msg
view model =
    div []
    [ page model ]

page : Model -> Html Msg
page model =
    if model.currentIndex == -1
       then text "NOTHING"
       else
       TweetText.Article.view (get model.currentIndex model.tweets)


-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
    [ addTweets Msgs.AddTweets ]


-- MAIN


main : Program Never Model Msg
main =
    program
    { init = init
    , view = view
    , update = update
    , subscriptions = subscriptions
    }

