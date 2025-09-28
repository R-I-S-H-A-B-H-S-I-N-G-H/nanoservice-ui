import { useState, useEffect, useReducer } from "react";
import type { Media } from "../types";
import { MediaHeader } from "./MediaHeader";
import { MediaGrid } from "./MediaGrid";
import { MediaViewer } from "./MediaViewer";
import { MediaUpload } from "./MediaUpload";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL = 'https://6ljvfygiw7lc4qbgpipxczo3fi0zqeug.lambda-url.us-east-1.on.aws';

const fetchMedia = async (page: number): Promise<Media[]> => {
  console.log("Fetching media for page:", page);
  const response = await fetch(`${API_BASE_URL}/media/list`);
  const data = await response.json();
  return data.media;
};

// Reducer
interface MediaState {
  media: Media[];
  filteredMedia: Media[];
  selectedMedia: Media | null;
  currentIndex: number;
  loading: boolean;
  page: number;
  searchQuery: string;
}

type MediaAction =
  | { type: "FETCH_MEDIA_START" }
  | { type: "FETCH_MEDIA_SUCCESS"; payload: Media[] }
  | { type: "UPLOAD_MEDIA_SUCCESS"; payload: Media[] }
  | { type: "SET_SELECTED_MEDIA"; payload: Media | null }
  | { type: "SET_CURRENT_INDEX"; payload: number }
  | { type: "SET_SEARCH_QUERY"; payload: string };

const initialState: MediaState = {
  media: [],
  filteredMedia: [],
  selectedMedia: null,
  currentIndex: 0,
  loading: false,
  page: 1,
  searchQuery: "",
};

const mediaReducer = (state: MediaState, action: MediaAction): MediaState => {
  switch (action.type) {
    case "FETCH_MEDIA_START":
      return { ...state, loading: true };
    case "FETCH_MEDIA_SUCCESS":
      const newMedia = [...state.media, ...action.payload];
      return {
        ...state,
        loading: false,
        media: newMedia,
        filteredMedia: state.searchQuery
          ? newMedia.filter((m) =>
              m.name.toLowerCase().includes(state.searchQuery.toLowerCase())
            )
          : newMedia,
        page: state.page + 1,
      };
    case "UPLOAD_MEDIA_SUCCESS":
        const uploadedMedia = [...action.payload, ...state.media];
        return {
            ...state,
            media: uploadedMedia,
            filteredMedia: state.searchQuery
                ? uploadedMedia.filter((m) =>
                    m.name.toLowerCase().includes(state.searchQuery.toLowerCase())
                    )
                : uploadedMedia,
        };
    case "SET_SELECTED_MEDIA":
      return { ...state, selectedMedia: action.payload };
    case "SET_CURRENT_INDEX":
      return { ...state, currentIndex: action.payload, selectedMedia: state.filteredMedia[action.payload] };
    case "SET_SEARCH_QUERY":
      return {
        ...state,
        searchQuery: action.payload,
        filteredMedia: state.media.filter((m) =>
          m.name.toLowerCase().includes(action.payload.toLowerCase())
        ),
      };
    default:
      return state;
  }
};

export function MediaLibrary() {
  const [state, dispatch] = useReducer(mediaReducer, initialState);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    dispatch({ type: "FETCH_MEDIA_START" });
    fetchMedia(state.page).then((media) => {
      dispatch({ type: "FETCH_MEDIA_SUCCESS", payload: media });
    });
  }, []);

  const fetchMoreMedia = () => {
    if (state.loading) return;
    dispatch({ type: "FETCH_MEDIA_START" });
    fetchMedia(state.page).then((media) => {
      dispatch({ type: "FETCH_MEDIA_SUCCESS", payload: media });
    });
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
      !state.loading
    ) {
      fetchMoreMedia();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [state.loading]);

  const handleNext = () => {
    if (state.currentIndex === state.filteredMedia.length - 1) {
      fetchMoreMedia();
    }
    const nextIndex = state.currentIndex + 1;
    dispatch({ type: "SET_CURRENT_INDEX", payload: nextIndex });
  };

  const handlePrev = () => {
    const prevIndex = (state.currentIndex - 1 + state.filteredMedia.length) % state.filteredMedia.length;
    dispatch({ type: "SET_CURRENT_INDEX", payload: prevIndex });
  };

  const openGallery = (item: Media) => {
    const index = state.filteredMedia.findIndex((m) => m.id === item.id);
    dispatch({ type: "SET_CURRENT_INDEX", payload: index });
    dispatch({ type: "SET_SELECTED_MEDIA", payload: item });
  };

  const handleSearch = (query: string) => {
    dispatch({ type: "SET_SEARCH_QUERY", payload: query });
  };

  const handleUpload = async (files: FileList) => {
    const newMedia: Media[] = [];
    for (const file of Array.from(files)) {
        const response = await fetch(`${API_BASE_URL}/media`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: file.name,
                user_id: "user1",
                org_id: "org1",
                media_type: file.type,
            }),
        });
        const createdMedia = await response.json();
        console.log('Created Media:', createdMedia);
        // TODO: Upload the file to the upload_url from the response

        newMedia.push(createdMedia.media);
    }

    dispatch({ type: "UPLOAD_MEDIA_SUCCESS", payload: newMedia });
    setUploadDialogOpen(false);
  };

  return (
    <div className="flex flex-col sm:gap-4 sm:py-4">
      <MediaHeader onUpload={() => setUploadDialogOpen(true)} onSearch={handleSearch} />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
            <CardDescription>A list of your media files.</CardDescription>
          </CardHeader>
          <CardContent>
            <MediaGrid media={state.filteredMedia} onItemClick={openGallery} />
            {state.loading && <div className="text-center py-4">Loading...</div>}
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-{state.filteredMedia.length}</strong> of{" "}
              <strong>{state.media.length}</strong> media
            </div>
          </CardFooter>
        </Card>
      </main>
      {state.selectedMedia && (
        <MediaViewer
          media={state.selectedMedia}
          onClose={() => dispatch({ type: "SET_SELECTED_MEDIA", payload: null })}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      <MediaUpload 
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
