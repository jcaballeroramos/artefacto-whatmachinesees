export const TAXONOMY = {
    "Hand-made": {
        "description": "Media directly crafted by human hands without sophisticated mechanical or digital devices, reflecting manual skill and creativity.",
        "subcategories": {
            "Auditory": {
                "description": "Where the sound is produced and experienced in real-time without electronic amplification or modification.",
                "example": "Live musical performances, such as a symphonic orchestra."
            },
            "Visual": {
                "description": "Creations that capture or embody visual experiences through the artist's manual skill and creative vision, engaging the viewer's sense of sight directly.",
                "subcategories": {
                    "Static": {
                        "description": "Artworks that are designed to remain constant and unchanging over time, offering a single, unalterable visual experience.",
                        "example": "An oil painting where the artist applies pigments to canvas, creating a detailed landscape that captures a moment in time."
                    },
                    "Dynamic": {
                        "description": "Visual pieces that convey movement or change, crafted to create an illusion of motion or transformation as part of the viewing experience.",
                        "example": "The phenakistoscope, which uses a series of static images on a rotating disk, viewed through slits to create the illusion of a dancing figure."
                    }
                }
            }
        }
    },
    "Machine-made": {
        "description": "Media produced or captured through mechanical or electronic means, differentiated into two main categories based on how they handle reality or creativity.",
        "subcategories": {
            "Archival": {
                "description": "This category encompasses media that visually documents and preserves aspects of reality, scenes, or events with fidelity, utilizing mechanical or electronic means.",
                "subcategories": {
                    "Auditory": {
                        "description": "A field recording of natural sounds, such as a forest at dawn, capturing the environment's essence without modification.",
                        "example": "Sound recording. A direct recording of a jazz concert, capturing the ambient sound and music without any post-editing."
                    },
                    "Visual": {
                        "description": "The focus is on capturing visual content as it exists in the natural or constructed environment, with minimal alteration or interpretation by the creator.",
                        "subcategories": {
                            "Static": {
                                "description": "A documentary photograph of a historical event, taken to accurately record the moment without artistic intervention.",
                                "example": "Photograph. A journalistic photograph taken to capture a significant moment in news, unaltered and used for historical documentation, without digital manipulation."
                            },
                            "Dynamic": {
                                "description": "Video recordings or moving images that document real-life events as they unfold over time.",
                                "example": "Video recording. A home video of a family birthday party, capturing the event exactly as it happened."
                            }
                        }
                    }
                }
            },
            "Synthetic": {
                "description": "Synthetic media refers to content that's generated or significantly modified using digital tools, algorithms, or artificial intelligence, rather than captured directly through traditional means like photography, videography, or audio recordings. This category includes both totally synthetic media, which are created from scratch without any direct basis in existing archival material, and partially synthetic media, where existing media are altered or enhanced. The advent of deep learning (DL) has expanded the capabilities and applications of synthetic media, making it possible to generate highly realistic or creatively stylized content that blurs the line between reality and fabrication.",
                "subcategories": {
                    "Partially Synthetic": {
                        "description": "This category includes media that are modified through either global or local manipulations. These modifications can be applied to existing media, such as sound recordings, photographs, or videos, and involve techniques that range from traditional digital editing tools to advanced DL algorithms. The key characteristic is that these media start with real, recorded content which is then altered or enhanced to produce a new piece of media that retains a link to the original.",
                        "subcategories": {
                            "Global": {
                                "description": "This involves modifications applied uniformly across the entire piece of media. For example, altering the brightness, contrast, or applying a filter to a photograph affects the image as a whole. Similarly, adjusting the loudness, pitch, or adding reverb to an audio file changes the sound globally. These alterations can be achieved through a variety of means, not limited to DL.",
                                "subcategories": {
                                    "Traditional": {
                                        "description": "Specifically refers to global modifications made using traditional digital editing techniques without the direct application of DL algorithms. An instance would be using a graphic editor to apply a sepia tone to an entire photograph or a music production software to apply a reverb effect across an entire audio track.",
                                        "subcategories": {
                                            "Auditory": {
                                                "description": "Altering the overall sound characteristics using non-DL techniques, such as adjusting equalization or adding reverb across an entire audio track with traditional audio editing software.",
                                                "example": "Audio filter. Applying a vinyl effect across an entire music album to create a vintage sound."
                                            },
                                            "Visual": {
                                                "description": "Modifications applied to the entirety of a visual piece through conventional editing tools.",
                                                "subcategories": {
                                                    "Static": {
                                                        "description": "Applying global effects to a single image with traditional software.",
                                                        "example": "Image filter. Enhancing the brightness and contrast of a landscape photograph using photo editing software."
                                                    },
                                                    "Dynamic": {
                                                        "description": "Implementing global effects across a video file using non-DL editing tools.",
                                                        "example": "Video filter. Adjusting the color saturation for an entire video clip to match a specific color theme."
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "DL-BASED": {
                                        "description": "This subset focuses on global changes made through the use of deep learning technologies. Examples include using DL for voice conversion in audio files or applying style transfer to images and videos to alter their aesthetic to mimic the style of a particular artist or genre.",
                                        "subcategories": {
                                            "Auditory": {
                                                "description": "Partially synthetic global DL-based auditory media entail the application of deep learning (DL) algorithms to enact comprehensive changes across entire audio tracks. These modifications are executed uniformly throughout the audio, affecting its overall qualities such as tone, pitch, and ambiance. This approach leverages the computational power of DL to analyze and transform audio content on a global scale.",
                                                "example": "Voice conversation. Transforming the ambiance of an audio recording from an indoor setting to sound as if it were outdoors. A DL model is used to add environmental sounds and reverberations that mimic being outside, such as birds chirping or a breeze, applying these changes uniformly to give the entire track a coherent outdoor feel. Changing the musical style of a piece from classical to jazz across the entire track. A DL algorithm analyzes the structure and instruments of the original piece and recreates it in a jazz style, incorporating characteristic elements like swing rhythms and jazz chords, ensuring that the transformation is applied consistently throughout the track."
                                            },
                                            "Visual": {
                                                "description": "Utilizing DL for global visual modifications, affecting the whole image or video.",
                                                "subcategories": {
                                                    "Static": {
                                                        "description": "Partially synthetic global DL-based visual static media involve the use of deep learning (DL) algorithms to apply comprehensive modifications across entire static images. These modifications, achieved through advanced artificial intelligence techniques, impact the visual aspects of the images globally, ensuring uniformity in the applied effects or transformations.",
                                                        "example": "Visual enhancement. Applying the unique style of a famous painting, such as Vincent van Gogh's \"The Starry Night,\" to a photograph. The DL model analyzes and replicates Van Gogh's iconic brushstrokes and color palette, applying these characteristics across the entire image to transform a modern photo into an artwork that appears as if painted by Van Gogh himself. Using a DL algorithm to convert a daylight scene in a photograph into a night scene. This involves globally adjusting lighting, shadows, and colors to mimic nighttime, including adding artificial lighting effects like streetlights and moonlight, giving the impression that the original daytime photo was actually taken at night."
                                                    },
                                                    "Dynamic": {
                                                        "description": "Partially synthetic global DL-based visual dynamic media involve using deep learning (DL) models to apply global changes across entire video sequences, enhancing or transforming their visual dynamics in a cohesive manner. This technique utilizes the advanced capabilities of DL to analyze and modify video content, ensuring that the alterations are uniformly applied throughout the footage, resulting in a visually consistent transformation.",
                                                        "example": "Visual style transfer. Using DL models to change the weather conditions depicted in a video. For instance, transforming a sunny outdoor scene into a snowy landscape across the entire sequence, adding dynamically falling snow and altering the lighting to reflect a cold, wintry atmosphere. Employing DL technology to uniformly age or de-age actors throughout a film. This could involve making characters appear significantly younger or older than their actual age in every scene they appear, maintaining consistency in their appearance across various lighting conditions and angles."
                                                    }
                                                }
                                            },
                                            "frequent_uses":{
                                                "subcategories":{
                                                    "Technical Content Enhancement":{
                                                        "description": "Application of deep learning algorithms to improve the technical quality of preexisting audiovisual content. This includes upgrading the resolution of old videos, enhancing sound quality, and color correction to adapt them to contemporary viewing standards, while maintaining the authenticity of the original content.",
                                                        "subcategories":{
                                                            "72":{
                                                                "description":"Utilizes artificial intelligence techniques to enhance the quality of historical images and provide a detailed view of the drug crisis in Nepal, focusing on personal stories and community efforts to combat addiction.",
                                                                "link":"https://drive.google.com/file/d/1q1dMUiZwBsL0WCTftICTYg_m2-dtRCUd/view?usp=drive_link"
                                                        },
                                                            "100":{
                                                                "description":"Employs AI to restore old photographs of Chichen Itza, transforming historical footage into a contemporary visual format that captures key events from the year 1930",
                                                                "link":"https://www.youtube.com/watch?v=e__5bRMeZ9E"
                                                            } 
                                                        }
                                                    },
                                                    "Total Aesthetic Change and Style Transfers":{
                                                        "description":"Used to transform the visual and auditory style of existing content. Through style transfers, the material is adapted to different aesthetic contexts or completely reinterpreted, allowing the exploration of new narrative forms ranging from classical art to contemporary trends without altering the original narrative structure.",
                                                        "subcategories":{
                                                            "185":{
                                                                "description":"Uses AI to transform current images into apocalyptic visions through visual and sound effects, offering an aesthetic reinterpretation of the original content.",
                                                                "link":"https://youtu.be/d4C12_jmpiI"
                                                            },
                                                            "268":{
                                                                "description":"Modifies real images of the Atacama Desert to visualize new possibilities",
                                                                "link":"https://vimeo.com/923099408"
                                                            }
                                                            
                                                        }   
                                                    }       
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "Local": {
                                "description": "Contrasts with global modifications by focusing on alterations made to specific parts of the media. This might include removing an object from a photograph, adding sound effects to certain moments in an audio recording, or editing out a scene from a video.",
                                "subcategories": {
                                    "Traditional": {
                                        "description": "These are local modifications achieved through conventional digital editing methods. Examples include using Photoshop to edit out a photo bomber from a picture or adding CGI effects to a particular scene in a video through VFX software.",
                                        "subcategories": {
                                            "Auditory": {
                                                "description": "Modifying specific parts of an audio track using traditional methods.",
                                                "example": "Manually removing a cough sound from a recorded interview using audio editing software."
                                            },
                                            "Visual": {
                                                "description": "Traditional editing techniques used to alter specific areas within a visual medium.",
                                                "subcategories": {
                                                    "Static": {
                                                        "description": "Editing particular elements of a single image with conventional tools.",
                                                        "example": "Editing out a trash can from a street photograph for aesthetic improvement."
                                                    },
                                                    "Dynamic": {
                                                        "description": "Applying effects or modifications to specific parts of a video.",
                                                        "example": "Adding CGI explosions to specific scenes in a movie."
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "DL-BASED": {
                                        "description": "Local modifications achieved through DL technologies, such as deepfake technology for face swapping in videos, or altering specific sounds within a piece of music to isolate or remove them.",
                                        "subcategories": {
                                            "Auditory": {
                                                "description": "Partially synthetic local DL-based auditory media utilize deep learning (DL) algorithms to target and modify specific segments or elements within an audio track without altering its global properties. This approach enables precise interventions, such as isolating, enhancing, or transforming particular sounds or voices within a piece, leveraging DL's ability to understand and manipulate complex audio data at a granular level.",
                                                "example": "Speech / music source separation. Extracting the vocal track from a mixed music piece to isolate the singer's voice. A DL model can be trained to distinguish vocal elements from instrumental ones, allowing it to enhance the clarity and quality of the vocals for a specific verse or chorus, while leaving the rest of the track unchanged. Inserting a specific sound effect, like a phone ringing or a dog barking, into a podcast or audio drama at precise moments. DL algorithms can analyze the audio to find the most suitable insertion points that maintain naturalness and coherence with the surrounding content, applying the effect locally without affecting the overall track."
                                            },
                                            "Visual": {
                                                "description": "DL algorithms used for precise, localized visual alterations.",
                                                "subcategories": {
                                                    "Static": {
                                                        "description": "Partially synthetic local DL-based visual static media involve using deep learning (DL) algorithms to specifically target and modify localized elements within static images. This precision allows for the alteration, addition, or removal of certain features or objects in an image, leveraging the nuanced understanding and processing capabilities of DL models. These modifications are made without impacting the image's global composition, focusing instead on enhancing or transforming specific visual aspects.",
                                                        "example": "Faceswapping (original deepfakes) / Inpainting. Attribute manipulation. Altering specific attributes of a person's face in a photograph, such as changing eye color, adding a beard, or modifying the expression. A DL model can precisely identify and isolate the facial features to apply these changes realistically, affecting only the targeted areas while leaving the rest of the image untouched. Using DL algorithms to remove an unwanted object, like a trash can or a photobomber, from a scenic photo. The model carefully analyzes the image to extract the object seamlessly and fills in the background by predicting the surrounding textures and patterns, making the modification localized to the area previously occupied by the object."
                                                    },
                                                    "Dynamic": {
                                                        "description": "Partially synthetic local DL-based visual dynamic media use deep learning (DL) algorithms to modify or enhance specific segments or elements within video content. This focused approach allows for the alteration of particular details or features in a video sequence without changing the entire visual scene. DL models are adept at understanding and manipulating video data to achieve precise, localized modifications that can significantly alter the appearance or narrative of a video, while maintaining the integrity of the surrounding content.",
                                                        "example": "Faceswapping (original deepfakes) / Inpainting. Attribute manipulation. Modifying a character's facial expression in select scenes of a movie to better convey the intended emotion without affecting other aspects of the video. A DL algorithm can isolate the face, analyze its expressions, and apply realistic modifications to change the character's emotion in those specific moments, enhancing the storytelling.  Adding a digitally created object, like a product placement or a futuristic vehicle, into certain frames of a video. DL models can recognize the appropriate spatial and temporal locations to insert the object seamlessly, ensuring it blends naturally with the dynamic background and interacts convincingly with the live elements of the scene."
                                                    }
                                                }
                                            },
                                            "frequent_uses":{
                                                "subcategories":{
                                                    "Identity Protection":{
                                                        "description": "Focuses on the use of AI to alter identifiable features such as faces and voices in videos, in order to protect the privacy and security of the individuals depicted. Advanced anonymization techniques are used that allow for the modification of these elements without compromising the integrity of the overall content or the narrative, crucial for investigative documentaries or sensitive contexts.",
                                                        "subcategories":{
                                                            "106":{
                                                                "description":"Uses this technology to anonymize the stories of women exiled from the North Korean regime.",
                                                                "link":" https://creative.omg.lol/animation"
                                                            },
                                                            "215":{
                                                                "description":"Uses AI to protect the identities of child abuse victims.",
                                                                "link":"https://www.instagram.com/reel/C4NxSpAreqd/?igsh=YW5reXA5N3Rzc29r"
                                                            } 
                                                        }
                                                    },
                                                    "Deepfakes":{
                                                        "description":"In this category, AI is used to create or alter faces and voices, generating content that appears authentic. This application extends to recreating performances that are impossible to film, either due to casting limitations or specific narrative needs, offering even new audiovisual possibilities at a lower cost.",
                                                        "subcategories":{
                                                            "141":{
                                                                "description":"Lip syncing and modifying speeches of public figures like Sam Altman or Joe Biden to generate fictional documentary narratives.",
                                                                "link":"https://www.youtube.com/watch?v=LCZCPtyQMEc"
                                                            },
                                                            "165":{
                                                                "description":"Replacing actors like Sean Connery or Marilyn Monroe to reinterpret well-known movies with a surprising narrative.",
                                                                "link":"https://vimeo.com/911231006?share=copy, MyReality"
                                                            }
                                                        }   
                                                    },
                                                    "Animation of Specific Elements":{
                                                        "description":"This category involves the selective animation of elements within a realistic frame to add depth and visual or narrative details without the need to fully animate the scene. It is used to enrich the visual and auditory experience, allowing elements like magical objects or special effects to interact believably with the environment and actors.",
                                                        "subcategories":{
                                                            "142":{
                                                                "description":"Combines traditional animation with AI enhancements to explore themes of identity and media influence, providing a stylistic bridge between classic techniques and contemporary generative technologies.",
                                                                "link":"https://www.youtube.com/watch?v=CiKYNuBADhU"
                                                            },
                                                            "146":{
                                                                "description":"Creates a digital forest from LiDAR captures and AI animations, allowing viewers to experience a natural environment fused with technology.",
                                                                "link":"https://youtu.be/fF-7Ab_HEbo"
                                                            }
                                                        }
                                                    }       
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "Totally Synthetic": {
                        "description": "Media that are completely generated from scratch, with no direct basis in existing archival material. This encompasses both traditional forms of synthetic media creation, like CGI and electronic music production, as well as those generated through DL algorithms.",
                        "subcategories": {
                            "Traditional": {
                                "description": "Media generated entirely through traditional digital or analog methods, such as synthesizing music using keyboards or creating animations with computer graphics software.",
                                "subcategories": {
                                    "Auditory": {
                                        "description": "Generating new sounds or music from scratch with traditional synthesis methods.",
                                        "example": "Creating an electronic music track using synthesizers."
                                    },
                                    "Visual": {
                                        "description": "Producing visual content entirely from digital or analog methods without DL.",
                                        "subcategories": {
                                            "Static": {
                                                "description": "Traditional methods to create new images.",
                                                "example": "Digital painting of a landscape in a graphic design program."
                                            },
                                            "Dynamic": {
                                                "description": "Generating new videos or animations without using DL.",
                                                "example": "Creating a cartoon animation using frame-by-frame drawing digital techniques."
                                            }
                                        }
                                    }
                                }
                            },
                            "DL-BASED": {
                                "description": "Here, the creation process relies on DL models to generate entirely new content. Examples include generating realistic human faces that do not exist or creating music in a particular style, all of which are made possible by training DL models on large datasets to learn and then generate these outputs.",
                                "subcategories": {
                                    "Auditory": {
                                        "description": "Totally synthetic DL-based auditory media encompass audio content that is entirely generated from scratch using deep learning (DL) algorithms. This innovative approach leverages the power of DL to create new sounds, music, voiceovers, or any form of auditory content without relying on pre-recorded elements. These models can learn from vast datasets of existing audio to understand patterns, rhythms, and textures, enabling them to produce entirely new auditory experiences that mimic real-world sounds or invent entirely new ones.",
                                        "example": "Speech Synthesis. Music Generation. Creating a completely new voice that can read text aloud, mimicking human speech patterns and emotions. This could involve generating a narrator's voice for audiobooks or virtual assistant responses that does not correspond to any real person but sounds convincingly natural and expressive. Using DL to compose music in various styles, from classical to contemporary pop, without any human input in the composition process. The algorithm analyzes large collections of music to understand genre-specific elements, structure, and instrumentation, then composes new pieces that reflect these learned characteristics, producing original tracks that sound like they were composed by human musicians."
                                    },
                                    "Visual": {
                                        "description": "Creating entirely new visual content with DL.",
                                        "subcategories": {
                                            "Static": {
                                                "description": "Totally synthetic DL-based visual static media refer to entirely new images created from scratch using deep learning (DL) models. These images can range from realistic to fantastical, generated without direct reference to existing photographs or artworks. DL algorithms, particularly generative models like Generative Adversarial Networks (GANs), are trained on vast datasets to learn intricate patterns, textures, and forms, allowing them to synthesize novel visual content that can mimic real-world objects, scenes, or entirely new visual concepts.",
                                                "example": "Image generation. Generating images of human faces that do not correspond to any real individual. These faces are synthesized to appear as realistic as possible, complete with natural variations in features, expressions, and lighting, making them indistinguishable from actual photographs of people. Creating detailed images of buildings or interiors that have yet to be constructed. DL models can produce visualizations of architectural designs, providing a realistic depiction of how a structure would appear in various settings and lighting conditions, aiding in the design and decision-making process before any physical construction begins."
                                            },
                                            "Dynamic": {
                                                "description": "Totally synthetic DL-based visual dynamic media involve the creation of entirely new video content from scratch using deep learning (DL) models. These models can generate moving visual scenes, animations, or simulations without basing them on pre-recorded footage, allowing for the production of unique, dynamic content that can range from realistic video sequences to imaginative animations. By training on extensive datasets, DL algorithms learn to understand motion, continuity, and the subtleties of visual storytelling, enabling them to synthesize video content that can either mimic real-world dynamics or explore entirely novel visual narratives.",
                                                "example": "Video generation. Generating animated stories where characters, environments, and actions are entirely conceived by DL models. These short films can showcase complex narratives, emotional expressions, and interactions within entirely artificial settings, demonstrating a level of creativity and visual detail akin to traditional animation but created automatically by the algorithm. Creating dynamic simulations of environments for virtual reality (VR) experiences, such as walking through a forest or exploring an alien planet. DL models can render these environments in real-time, generating not just the visual details of the landscapes but also simulating natural movements such as the swaying of trees or the flow of water, providing an immersive experience that feels lifelike but is entirely synthetic."
                                            }
                                        }
                                    },
                                    "frequent_uses":{
                                        "subcategories":{
                                            "Historical Scene Reconstruction":{
                                                "description": "Involves the use of AI to recreate historical environments with great precision and detail. Based on historical research or data, they generate visualizations that offer deep immersion into specific periods and contexts that would otherwise be inaccessible or difficult to reproduce accurately.",
                                                "subcategories":{
                                                    "17":{
                                                        "description":"An interview with an Auschwitz survivor, with AI-generated reconstructions of the horrors experienced.",
                                                        "link":"https://app.milanote.com/1QYSln1RuQGn37?p=stmAiC9LUbL"
                                                },
                                                    "49":{
                                                        "description":"Recreation of the 1914 South Pole expedition, using AI to 'interview' expedition members combined with supposed reconstructed historical diaries.",
                                                        "link":"https://f.io/8iCd4TI1"
                                                    } 
                                                }
                                            },
                                            "Character Creation":{
                                                "description":"Employed to develop complex and detailed characters that can be used in various audiovisual applications, from films to video games. These AI-generated characters aim to exhibit features that would require large production efforts.",
                                                "subcategories":{
                                                    "21":{
                                                        "description":"A film using AI to design realistic characters who interact with viewers on issues of social inclusion.",
                                                        "link":"https://www.dropbox.com/scl/fi/tmnaqr1n3hutbl4hc3u3v/Storybaord_KABITA.pdf?rlkey=3xo9bgum9pf9uv640y4w74v6p&dl=0"
                                                        },
                                                    "41":{
                                                        "description":"An Iranian archaeologist discovers a time-traveling stone, with historical figures generated by AI guiding him through ancient advanced civilizations.",
                                                        "link":""
                                                    },
                                                    "253":{
                                                        "description":"A project that realistically reconstructs biblical scenes and narratives from pharaonic times.",
                                                        "link":"https://drive.google.com/file/d/1Xj89BVm1ndYzAGgfwXSd6JXK1YK8Es18/view?usp=sharing"
                                                    }
                                                }   
                                            },
                                            "Visualization of Complex Concepts":{
                                                "description":"AI is used to create visual representations of ideas, theories, or processes that are inherently difficult to visualize, such as scientific or mathematical phenomena, enabling better understanding and teaching of abstract concepts.",
                                                "subcategories":{
                                                    "8":{
                                                        "description":"Uses AI to create visual narratives that incorporate musical theory and mathematical principles, visualizing the complex relationship between music, numbers, and human perception.",
                                                        "link":""
                                                        },
                                                    "12":{
                                                        "description":"A neuroscience documentary that aims to transform thoughts into vivid images, exploring the ethical and personal implications of such technologies.",
                                                        "link":"https://youtu.be/YvVmaUTnuHE?si=7Ke_PpegWOR1El4f"
                                                    }
                                                }
                                            },
                                            "Visualization of Mental Processes":{
                                                "description":"AI is used to represent mental processes, emotions, or psychological conditions, offering a window into the inner workings of the human mind through visualizations that interpret feelings and/or thoughts.",
                                                "subcategories":{
                                                    "4":{
                                                        "description":"Represents the psychedelic experiences of a character based on their descriptions of drug-induced visions.",
                                                        "link":"https://coalharbourproductions.com/#home"
                                                    },
                                                    "66":{
                                                        "description":"Explores the psychological effects of panic attacks through stylized and surreal visualizations of dream sequences and real-life scenarios.",
                                                        "link":"https://vimeo.com/625800609"
                                                    }
                                                }
                                            },
                                            "Visualization of Inaccessible Spaces": {
                                                "description":"Focuseson depicting spaces that are difficult or impossible to physically access, such as remote locations, underwater environments, or outer space.",
                                                "subcategories":{
                                                    "68":{
                                                        "description":"A documentary about the life of mollusks in the New York harbor, using AI to recreate habitats and simulate historical events.",
                                                        "link":"https://drive.google.com/file/d/1rnYdTGhxuBfiHlhxXKA0CSNIasEDy2Lz/view?usp=sharing"
                                                        },
                                                    "40":{
                                                        "description":"Explores microscopic ecosystems with photorealistic environments generated by AI, educating about their complexity, beauty, and conservation.",
                                                        "link":"https://photos.app.goo.gl/2xaLPA5sTDJV6mFk8"
                                                    }
                                                }       
                                            },
                                            "Creation of Futuristic or Fantastical Scenarios":{
                                                "description":"Uses AI to design and generate new, imaginary, or futuristic representations; unbounded by real-world filming locations. This capability allows for the exploration and materialization of scenarios such as futuristic cities or alien planets with a special focus on details.",
                                                "subcategories":{
                                                    "20":{
                                                        "description":"Visualizes futuristic technologies for carbon capture in Kenya, highlighting innovative carbon reduction strategies.",
                                                        "link":"https://www.canva.com/design/DAFzYMQ5oW0/TxCQTZcHcetLlG9ccShoHA/view?utm_content=DAFzYMQ5oW0&utm_campaign=designshare&utm_medium=link&utm_source=editor"
                                                        },
                                                    "134":{
                                                        "description":"Depicts a post-apocalyptic future where robots mourn the extinction of humanity, created entirely by AI to offer a perspective on human legacy and technological ethics.",
                                                        "link":"https://youtu.be/zQ9SBMfY9lQ"
                                                    }
                                                }
    
                                            }       
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};