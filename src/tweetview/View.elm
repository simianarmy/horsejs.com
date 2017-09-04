module View exposing (..)

import Html exposing (Html, program, div, text, program, article, a)
import Html.Attributes exposing (class, href)
import Html.Events exposing (onClick)
import Models exposing (Model, Tweet, TweetId, getTweetById, dropUpTo, maybeDropUpTo)
import Msgs exposing (Msg)
import TweetText.Article

view : Model -> Html Msg
view model =
    div []
    [ page model ]

page : Model -> Html Msg
page model =
    case Debug.log "current tid" model.currentTweetId of
        Just tid ->
            showTweet model tid
        Nothing ->
            nextTweetButton model

showTweet : Model -> String -> Html Msg
showTweet model id =
    let tweet = getTweetById id model.tweets
    in
       div []
       [ TweetText.Article.view tweet model.wordCountVisible
       , nextTweetButton model ]

nextTweetButton : Model -> Html Msg
nextTweetButton model =
    if List.isEmpty <| maybeDropUpTo model.currentTweetId model.tweets
       then div [] [ text "No more" ]
       else
       a
       [ class "btn regular"
       --, href <| tweetPath t.tid
       , onClick Msgs.ShowNext
       ]
       [ text "Giddy Up" ]

waitingForMoreView : Html msg
waitingForMoreView =
    div [] [ text "wait..." ]

notFoundView : Html msg
notFoundView =
    div []
    [ text "Not found" ]
