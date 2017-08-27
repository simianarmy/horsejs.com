module TweetText.Article exposing (..)

view : Model -> Html Msg
view model =
    article [id "saddle"] [
        div [] [ div [ corralAttributes model ] [] ]
        , div [id "neigh"] []
        ]

corralAttributes : Model -> Html.Attribute msg
corralAttributes model =
    case model.tweet of
        Just t ->
            HA.style [ ("opacity", "0.5")
                  , ("class", saddleClass model)
                  ]
        Nothing ->
            HA.style [ ("opacity", "1") ]

saddleClass : Model -> String
saddleClass model =
    "harras1"
