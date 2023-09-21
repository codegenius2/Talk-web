// import backgroundImage from 'assets/bg/wikiart';
import balloonImage from "../assets/bg/no-copyright/959e3384818869.5d6bfdf2b5e1b.png";
import walkImage from "../assets/bg/no-copyright/84974784818869.5d6bfdf4e8260.png";
import simultaneousImage from "../assets/bg/wikiart-public-domain/simultaneous-counter-composition-1930.jpg";

export type Art = {
    author: string
    name: string
    date: string
    imageUrl: string
    pageUrl: string
    imageClassName?: string
    noiseClassname?: string
}

export const wikiarts: Art[] = [
    {
        // use a local file as default wallpaper, should access to wikiart.org be limited
        imageUrl: simultaneousImage,
        pageUrl: "https://www.wikiart.org/en/theo-van-doesburg/simultaneous-counter-composition-1930",
        name: "Simultaneous Counter Composition",
        author: "Theo van Doesburg",
        date: "1930; Germany",
        imageClassName: "bg-cover bg-center blur brightness-75",
        noiseClassname: "opacity-80 brightness-125"
    },
    {
        imageUrl: "https://uploads8.wikiart.org/images/wassily-kandinsky/green-emptyness-1930.jpg",
        pageUrl: "https://www.wikiart.org/en/wassily-kandinsky/green-emptyness-1930",
        name: "Green emptyness",
        author: "Wassily Kandinsky",
        date: "1930",
    },
    {
        imageUrl: "https://uploads8.wikiart.org/images/wassily-kandinsky/not_detected_189367.jpg",
        pageUrl: "https://www.wikiart.org/en/wassily-kandinsky/not_detected_189367",
        name: "Picture II, Gnomus",// (Stage set for Mussorgsky's Pictures at an Exhibition in Friedrich Theater, Dessau)
        author: "Wassily Kandinsky",
        date: "1928",
        imageClassName: "bg-contain blur-lg brightness-75",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads1.wikiart.org/images/wassily-kandinsky/composition-viii-1923.jpg",
        pageUrl: "https://www.wikiart.org/en/wassily-kandinsky/composition-viii-1923",
        name: "Composition VIII",
        author: "Wassily Kandinsky",
        date: "1923; Germany",
        imageClassName: "bg-cover bg-center blur-md brightness-75",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads6.wikiart.org/alchemy-1947(2).jpg",
        pageUrl: "https://www.wikiart.org/en/jackson-pollock/alchemy-1947",
        name: "Alchemy",
        author: "Jackson Pollock",
        date: "1947",
    },
    {
        imageUrl: "https://uploads0.wikiart.org/images/jackson-pollock/number-17-1949.jpg",
        pageUrl: "https://www.wikiart.org/en/jackson-pollock/number-17-1949",
        name: "Number 17",
        author: "Jackson Pollock",
        date: "1949",
    },
    {
        imageUrl: "https://uploads4.wikiart.org/number-8-detail(1).jpg",
        pageUrl: "https://www.wikiart.org/en/jackson-pollock/number-8-detail",
        name: "Number 8, (detail)",
        author: "Jackson Pollock",
        date: "1949",
    },
    {
        imageUrl: "https://uploads6.wikiart.org/full-fathom-five(1).jpg",
        pageUrl: "https://www.wikiart.org/en/jackson-pollock/full-fathom-five",
        name: "Full fathom five",
        author: "Jackson Pollock",
        date: "1947",
    },
    {
        imageUrl: "https://uploads3.wikiart.org/00215/images/marina-abramovic/abramovic-breathing-in-breathing-out.jpg",
        pageUrl: "https://www.wikiart.org/en/jackson-pollock/full-fathom-five",
        name: "Breathing In/Breathing Out",
        author: "Marina Abramović",
        date: "1977",
        imageClassName: "bg-cover bg-top blur-sm",
    },
    {
        imageUrl: "https://uploads0.wikiart.org/00328/images/maximilien-luce/maximilien-luce-rue-ravignan-paris-98-289-museum-of-fine-arts-houston.jpg",
        pageUrl: "https://www.wikiart.org/en/maximilien-luce/rue-ravignan-paris-1893",
        name: "Rue Ravignan, Paris",
        author: "Maximilien Luce",
        date: "1893",
        imageClassName: "bg-cover bg-center blur-sm brightness-75",
    },
    // remove
    {
        imageUrl: "https://uploads7.wikiart.org/00134/images/henri-matisse/sun-stree-1905.jpg",
        pageUrl: "https://www.wikiart.org/en/henri-matisse/sun-street-1905",
        name: "Sun Street",
        author: "Henri Matisse",
        date: "1905",
        imageClassName: "bg-cover bg-center blur-sm brightness-50",
        noiseClassname: "opacity-60 brightness-150"
    },
    {
        imageUrl: "https://uploads0.wikiart.org/images/takashi-murakami/flowers-in-heaven-2010.jpg",
        pageUrl: "https://www.wikiart.org/en/takashi-murakami/flowers-in-heaven-2010",
        name: "Flowers in Heaven",
        author: "Takashi Murakami",
        date: "2010",
        imageClassName: "bg-cover bg-center blur brightness-50",
    },
    {
        imageUrl: "https://uploads1.wikiart.org/images/yayoi-kusama/dots-2004.jpg",
        pageUrl: "https://www.wikiart.org/en/yayoi-kusama/dots-2004",
        name: "Dots",
        author: "Yayoi Kusama",
        date: "2004",
        imageClassName: "bg-cover bg-center blur brightness-50",
    },
    {
        imageUrl: "https://uploads4.wikiart.org/images/henri-edmond-cross/the-pink-cloud.jpg",
        pageUrl: "https://www.wikiart.org/en/henri-edmond-cross/the-pink-cloud",
        name: "The Pink Cloud",
        author: "Henri-Edmond Cross",
        date: "1896",
        imageClassName: "bg-contain blur brightness-75",
        noiseClassname: "opacity-80 brightness-150"
    },
    {
        imageUrl: "https://uploads2.wikiart.org/images/theo-van-rysselberghe/moonlight-night-in-boulogne.jpg",
        pageUrl: "https://www.wikiart.org/en/theo-van-rysselberghe/moonlight-night-in-boulogne",
        name: "Moonlight Night in Boulogne",
        author: "Theo van Rysselberghe",
        date: "",
        imageClassName: "bg-contain blur brightness-50",
        noiseClassname: "opacity-80 brightness-150"
    },
    {
        imageUrl: "https://uploads6.wikiart.org/images/balthus/nude-with-cat-1949.jpg",
        pageUrl: "https://www.wikiart.org/en/balthus/nude-with-cat-1949",
        name: "Nude with Cat",
        author: "Balthus",
        date: "1949",
        imageClassName: "bg-cover bg-center blur-sm brightness-75",
        noiseClassname: "opacity-80 brightness-125"
    },
    {
        imageUrl: "https://uploads7.wikiart.org/images/joan-miro/blue-iii.jpg",
        pageUrl: "https://www.wikiart.org/en/joan-miro/blue-iii",
        name: "Blue III",
        author: "Joan Miro",
        date: "1961",
        imageClassName: "bg-cover bg-top blur-sm brightness-50",
    },
    {
        imageUrl: "https://uploads3.wikiart.org/images/leonardo-da-vinci/study-of-a-woman-s-head.jpg",
        pageUrl: "https://www.wikiart.org/en/leonardo-da-vinci/study-of-a-woman-s-head",
        name: "Study of a woman's head",
        author: "Leonardo da Vinci",
        date: "c.1490",
        imageClassName: "bg-contain brightness-50",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads8.wikiart.org/images/claude-monet/the-wheat-field.jpg",
        pageUrl: "https://www.wikiart.org/en/claude-monet/the-wheat-field",
        name: "The Wheat Field",
        author: "Claude Monet",
        date: "1881",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads5.wikiart.org/images/claude-monet/jeanne-marguerite-lecadre-in-the-garden.jpg",
        pageUrl: "https://www.wikiart.org/en/claude-monet/jeanne-marguerite-lecadre-in-the-garden",
        name: "Jeanne-Marguerite Lecadre in the Garden",
        author: "Claude Monet",
        date: "1866",
        imageClassName: "bg-cover bg-center blur-sm brightness-75",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads7.wikiart.org/images/georges-seurat/study-for-the-channel-at-gravelines-evening-1890.jpg",
        pageUrl: "https://www.wikiart.org/en/georges-seurat/study-for-the-channel-at-gravelines-evening-1890",
        name: "Study for 'The Channel at Gravelines, Evening",
        author: "Georges Seurat",
        date: "1890; France",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads4.wikiart.org/images/georges-seurat/seated-bather-1883.jpg",
        pageUrl: "https://www.wikiart.org/en/georges-seurat/seated-bather-1883",
        name: "Seated Bather",
        author: "Georges Seurat",
        date: "1883; France",
        imageClassName: "bg-cover bg-top blur brightness-75",
        noiseClassname: "opacity-60 brightness-100"
    },
    {
        imageUrl: "https://uploads1.wikiart.org/images/wassily-kandinsky/red-wall-destiny-1909.jpg",
        pageUrl: "https://www.wikiart.org/en/wassily-kandinsky/red-wall-destiny-1909",
        name: "Red Wall destiny",
        author: "Wassily Kandinsky",
        date: "1909; Munich / Monaco, Germany",
        imageClassName: "bg-contain blur brightness-75",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads8.wikiart.org/images/wassily-kandinsky/night-1907.jpg",
        pageUrl: "https://www.wikiart.org/en/wassily-kandinsky/night-1907",
        name: "Night",
        author: "Wassily Kandinsky",
        date: "1907; Munich / Monaco, Germany",
        imageClassName: "bg-cover bg-left blur brightness-75",
        noiseClassname: "opacity-60 brightness-100"
    },
    {
        imageUrl: "https://uploads0.wikiart.org/images/wassily-kandinsky/small-worlds-vii-1922.jpg",
        pageUrl: "https://www.wikiart.org/en/wassily-kandinsky/small-worlds-vii-1922",
        name: "Small Worlds VII",
        author: "Wassily Kandinsky",
        date: "1922; Germany",
        imageClassName: "bg-cover bg-center blur brightness-75",
        noiseClassname: "opacity-60 brightness-100"
    },
    {
        imageUrl: "https://uploads0.wikiart.org/images/henri-rousseau/the-sleeping-gypsy-1897.jpg",
        pageUrl: "https://www.wikiart.org/en/henri-rousseau/the-sleeping-gypsy-1897",
        name: "The Sleeping Gypsy",
        author: "Henri Rousseau",
        date: "1897",
        imageClassName: "bg-cover bg-center blur brightness-75",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads7.wikiart.org/images/claude-monet/the-green-wave.jpg",
        pageUrl: "https://www.wikiart.org/en/claude-monet/the-green-wave",
        name: "The Green Wave",
        author: "Claude Monet",
        date: "1866",
        imageClassName: "bg-cover bg-top blur brightness-75",
    },
    {
        imageUrl: "https://uploads4.wikiart.org/images/claude-monet/the-marina-at-argenteuil-1872.jpg",
        pageUrl: "https://www.wikiart.org/en/claude-monet/the-green-wave",
        name: "The Marina at Argenteuil",
        author: "Claude Monet",
        date: "1872",
    },
    {
        imageUrl: "https://uploads5.wikiart.org/images/cy-twombly/returning-from-tonnicoda.jpg",
        pageUrl: "https://www.wikiart.org/en/cy-twombly/returning-from-tonnicoda",
        name: "Returning from Tonnicoda",
        author: "Cy Twombly",
        date: "1973",
        imageClassName: "bg-cover bg-bottom blur-md brightness-75",
    },
    {
        imageUrl: "https://uploads1.wikiart.org/images/cy-twombly/untitled-10.jpg",
        pageUrl: "https://www.wikiart.org/en/cy-twombly/untitled-10",
        name: "Untitled",
        author: "Cy Twombly",
        date: "1970",
        imageClassName: "bg-cover bg-bottom blur-md brightness-75",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads8.wikiart.org/images/katsushika-hokusai/asakusa-honganji-temple-in-th-eastern-capital.jpg",
        pageUrl: "https://www.wikiart.org/en/katsushika-hokusai/asakusa-honganji-temple-in-th-eastern-capital",
        name: "Asakusa Honganji temple in th Eastern capital",
        author: "Katsushika Hokusai",
        date: "1874",
        imageClassName: "bg-cover bg-center blur-md brightness-75",
    },
    {
        imageUrl: "https://uploads3.wikiart.org/images/henri-rousseau/the-mill.jpg",
        pageUrl: "https://www.wikiart.org/en/henri-rousseau/the-mill",
        name: "The Mill",
        author: "Henri Rousseau",
        date: "c.1896",
        imageClassName: "bg-cover bg-bottom blur-md brightness-75",
    },
    {
        imageUrl: "https://uploads3.wikiart.org/images/cindy-sherman/untitled-film-still-31-1979.jpg",
        pageUrl: "https://www.wikiart.org/en/richard-prince/untitled-cowboy-1989",
        name: "Untitled (Cowboy)",
        author: "Richard Prince",
        date: "1989",
        imageClassName: "bg-cover bg-right brightness-75",
        noiseClassname: "opacity-80 brightness-100"
    },
    {
        imageUrl: "https://uploads7.wikiart.org/images/leon-berkowitz/untitled-1975.jpg",
        pageUrl: "https://www.wikiart.org/en/leon-berkowitz/untitled-1975",
        name: "Untitled",
        author: "Leon Berkowitz",
        date: "1975",
        imageClassName: "bg-cover bg-center brightness-75",
    },
    {
        imageUrl: "https://uploads6.wikiart.org/images/alma-woodsey-thomas/air-view-of-a-spring-nursery-1966.jpg",
        pageUrl: "https://www.wikiart.org/en/alma-woodsey-thomas/air-view-of-a-spring-nursery-1966",
        name: "Air View of a Spring Nursery",
        author: "Alma Woodsey Thomas",
        date: "1966",
        imageClassName: "bg-cover bg-top blur-lg brightness-75",
    },
    {
        imageUrl: "https://uploads1.wikiart.org/images/alma-woodsey-thomas/iris-tulips-jonquils-and-crocuses-1969.jpg",
        pageUrl: "https://www.wikiart.org/en/alma-woodsey-thomas/iris-tulips-jonquils-and-crocuses-1969",
        name: "Iris, Tulips, Jonquils, and Crocuses",
        author: "Alma Woodsey Thomas",
        date: "1969",
        imageClassName: "bg-cover bg-bottom blur-lg brightness-75",
    },
    {
        imageUrl: "https://uploads3.wikiart.org/images/alma-woodsey-thomas/earth-sermon-beauty-love-and-peace-1971.jpg",
        pageUrl: "https://www.wikiart.org/en/alma-woodsey-thomas/earth-sermon-beauty-love-and-peace-1971",
        name: "Earth Sermon, Beauty, Love And Peace",
        author: "Alma Woodsey Thomas",
        date: "1971",
        imageClassName: "bg-cover bg-center blur-md brightness-100",
    },
    {
        imageUrl: "https://uploads0.wikiart.org/images/alma-woodsey-thomas/white-daisies-rhapsody-1973.jpg",
        pageUrl: "https://www.wikiart.org/en/alma-woodsey-thomas/white-daisies-rhapsody-1973",
        name: "White Daisies Rhapsody",
        author: "Alma Woodsey Thomas",
        date: "1973",
        imageClassName: "bg-cover bg-center blur brightness-75",
    },
    {
        imageUrl: "https://uploads2.wikiart.org/images/alma-woodsey-thomas/oriental-garden-concerto-1976.jpg",
        pageUrl: "https://www.wikiart.org/en/alma-woodsey-thomas/oriental-garden-concerto-1976",
        name: "Oriental Garden Concerto",
        author: "Alma Woodsey Thomas",
        date: "1976",
        imageClassName: "bg-cover bg-center blur-xl brightness-75",
    },
    {
        imageUrl: "https://uploads2.wikiart.org/images/alma-woodsey-thomas/red-azaleas-singing-and-dancing-rock-and-roll-music-1976.jpg",
        pageUrl: "https://www.wikiart.org/en/alma-woodsey-thomas/red-azaleas-singing-and-dancing-rock-and-roll-music-1976",
        name: "Red Azaleas Singing and Dancing Rock and Roll Music",
        author: "Alma Woodsey Thomas",
        date: "1976",
        imageClassName: "bg-cover bg-center blur-md brightness-75",
    },
    {
        imageUrl: "https://uploads3.wikiart.org/images/alma-woodsey-thomas/white-roses-sing-and-sing-1976.jpg",
        pageUrl: "https://www.wikiart.org/en/alma-woodsey-thomas/white-roses-sing-and-sing-1976",
        name: "White Roses Sing and Sing",
        author: "Alma Woodsey Thomas",
        date: "1976",
        imageClassName: "bg-cover bg-center blur-md brightness-75",
    },
]

export const otherArts: Art[] = [
    {
        imageUrl: balloonImage,
        pageUrl: "https://www.behance.net/gallery/84818869/Fuzzies-vol-1",
        name: "Balloon",
        author: "Hank Washington",
        date: "2019",
        imageClassName: "bg-cover bg-top blur-lg brightness-75",
        noiseClassname: "opacity-80 brightness-150"
    },
    {
        imageUrl: walkImage,
        pageUrl: "https://www.behance.net/gallery/84818869/Fuzzies-vol-1",
        name: "Walk",
        author: "Hank Washington",
        date: "2019",
        imageClassName: "bg-cover bg-center blur-lg brightness-75",
        noiseClassname: "opacity-80 brightness-150"
    },
]

export const allArts = [...wikiarts]