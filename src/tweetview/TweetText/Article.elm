module TweetText.Article exposing (..)

import Html exposing (Html, div, text, program, article)
import Html.Attributes as HA exposing (id)

import Models exposing (Tweet, emptyTweet)
import Msgs exposing (Msg)

maxStyles : Int
maxStyles = 48

view : Maybe Tweet -> Html Msg
view model =
    let tview = case model of
        Just tweet -> tweetView tweet
        Nothing -> emptyView
    in
    article [id "saddle"] [ tview ]


tweetView : Tweet -> Html Msg
tweetView tweet =
    div [ HA.style [ ("opacity", "0.5")
         , ("class", saddleClass tweet) ] ]
        [ div [id "neigh"] [ neigh tweet ] ]


emptyView : Html Msg
emptyView =
    div [ HA.style [ ("opacity", "1") ] ]
    [ text "no tweet" ]


neigh : Tweet -> Html Msg
neigh tweet =
    text <| "found one: " ++ (String.join " " tweet.words)


saddleClass : Tweet -> String
saddleClass model =
    "harras1"
