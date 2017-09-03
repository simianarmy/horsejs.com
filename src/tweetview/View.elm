module View exposing (..)

import Html exposing (Html, program, div, text, program, article, a)
import Html.Attributes exposing (class, href)
import Models exposing (Model, Tweet, TweetId, getTweetById)
import Msgs exposing (Msg)
import TweetText.Article
import Routing exposing (tweetPath)


view : Model -> Html Msg
view model =
    div []
    [ page model ]

page : Model -> Html Msg
page model =
    case model.route of
        Models.TweetsRoute ->
            nextTweetButton model

        Models.TweetRoute id ->
            let tweet = getTweetById id model.tweets
            in
               div []
               [ TweetText.Article.view tweet model.wordCountVisible
               , nextTweetButton model ]

        Models.NotFoundRoute ->
            notFoundView


nextTweetButton : Model -> Html Msg
nextTweetButton model =
    let remaining = Maybe.withDefault [] <| List.tail model.tweets
        nextTweet = List.head remaining
    in
       case nextTweet of
           Just t ->
               a
               [ class "btn regular"
               , href <| tweetPath t.tid
               ]
               [ text "Giddy Up" ]

           Nothing ->
              div [] [ text "No more" ]

notFoundView : Html msg
notFoundView =
    div []
    [ text "Not found" ]
