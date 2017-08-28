module TweetText.Article exposing (..)

import Html exposing (Html, div, text, program, article)
import Html.Attributes as HA exposing (id)

import Models exposing (Tweet)
import Msgs exposing (Msg)

maxStyles : Int
maxStyles = 48

view : Maybe Tweet -> Html Msg
view model =
    article [id "saddle"] [
        div [] [ div [ corralAttributes model ] [] ]
        , div [id "neigh"] []
        ]

corralAttributes : Maybe Tweet -> Html.Attribute msg
corralAttributes model =
    case model of
        Just t ->
            HA.style [ ("opacity", "0.5")
                  , ("class", saddleClass t)
                  ]
        Nothing ->
            HA.style [ ("opacity", "1") ]

saddleClass : Tweet -> String
saddleClass model =
    "harras1"
