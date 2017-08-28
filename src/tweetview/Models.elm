module Models exposing (..)

import Array exposing (Array)

type alias Tweet =
    { tid: String
    , words: List String
    }

type alias Model =
    { tweets: Array Tweet
    , currentIndex: Int
    }

initialModel : Model
initialModel =
    Model Array.empty -1
