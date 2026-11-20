package com.tecnocampus.LS2.protube_back.services.mappers;

import com.tecnocampus.LS2.protube_back.model.Category;
import com.tecnocampus.LS2.protube_back.model.User;
import com.tecnocampus.LS2.protube_back.model.Video;
import com.tecnocampus.LS2.protube_back.services.DTO.in.CreateVideoDTO;
import com.tecnocampus.LS2.protube_back.services.DTO.out.VideoInfoDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class VideoMapperTest {

    private final VideoUserMapper videoUserMapper = new VideoUserMapper();
    private final CommentMapper commentMapper = new CommentMapper(videoUserMapper);
    private final CategoryMapper categoryMapper = new CategoryMapper();
    private final VideoMapper mapper = new VideoMapper(videoUserMapper, commentMapper, categoryMapper);

    @Test
    void createVideoDtoShortConstructorDefaultsFileIds() {
        CreateVideoDTO dto = new CreateVideoDTO("Title", "Description", List.of("gaming"));

        assertEquals("Title", dto.title());
        assertEquals(List.of("gaming"), dto.categories());
        assertNull(dto.videoFid());
        assertNull(dto.thumbnailFid());
    }

    @Test
    void toDtoMapsVideoFieldsCorrectly() throws Exception {
        User author = new User("creator", "creator@example.com");
        author.setDisplayName("Creator");

        Category category = new Category("1", "Gaming");
        Video video = new Video("Video Title", "Video Description", author, Set.of(category));
        video.setVideoFid("video123");
        video.setThumbnailFid("thumb123");

        VideoInfoDTO dto = mapper.toDTO(video);

        assertNotNull(dto);
        assertEquals("Video Title", dto.title());
        assertEquals("Video Description", dto.description());
        assertEquals("video123", dto.videoFid());
        assertEquals("thumb123", dto.thumbnailFid());
        assertNotNull(dto.author());
        assertEquals("creator", dto.author().userName());
        assertEquals(1, dto.categories().size());
        assertEquals("1", dto.categories().get(0).id());
        assertEquals(0L, dto.likes());
        assertEquals(0L, dto.views());
    }

    @Test
    void toDtoReturnsNullWhenVideoIsNull() {
        assertNull(mapper.toDTO(null));
    }

    @Test
    void toEntityMapsCreateVideoDtoToVideoCorrectly() throws Exception {
        CreateVideoDTO dto = new CreateVideoDTO(
                "New Title",
                "New Description",
                List.of("1", "2")
        );

        Video video = mapper.toEntity(dto);

        assertNotNull(video);
        assertEquals("New Title", fieldValue(video, "title"));
        assertEquals("New Description", fieldValue(video, "description"));

        assertNull(fieldValue(video, "author"));

        @SuppressWarnings("unchecked")
        Set<Category> categories = (Set<Category>) fieldValue(video, "categories");
        assertNotNull(categories);
        assertEquals(0, categories.size());
    }

    @Test
    void toEntityMapsUploadedFileIds() {
        CreateVideoDTO dto = new CreateVideoDTO(
                "New Title",
                "New Description",
                List.of(),
                "video-fid",
                "thumbnail-fid"
        );

        Video video = mapper.toEntity(dto);

        assertEquals("video-fid", video.getVideoFid());
        assertEquals("thumbnail-fid", video.getThumbnailFid());
    }

    @Test
    void createVideoRequestDeserializesUploadedFileIds() throws Exception {
        String json = """
                {
                  "title": "New Title",
                  "description": "New Description",
                  "categories": [],
                  "videoFid": "video-fid",
                  "thumbnailFid": "thumbnail-fid"
                }
                """;

        CreateVideoDTO dto = new ObjectMapper().readValue(json, CreateVideoDTO.class);

        assertEquals("video-fid", dto.videoFid());
        assertEquals("thumbnail-fid", dto.thumbnailFid());
    }

    @Test
    void toEntityReturnsNullWhenDtoIsNull() {
        assertNull(mapper.toEntity(null));
    }

    private Object fieldValue(Object target, String fieldName) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(target);
    }
}
