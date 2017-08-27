module Models exposing (..)

maxStyles = 48

type alias Tweet =
    { tid: String
    , words: List String
    }

type alias Model =
    { tweet: Maybe Tweet
    }

initialModel : Model
initialModel =
    Model Nothing
