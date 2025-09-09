# Mobile App Integration Guide: Flutter + Football Highlights API

## Overview
This guide provides comprehensive instructions for Flutter developers to integrate with the Football Highlights API. The API serves as a unified interface for both web (Next.js) and mobile (Flutter) applications, providing access to football highlights from multiple providers.

## API Base URL
```
https://your-domain.com/api/v1
```

## Authentication
The API uses Bearer token authentication for protected endpoints:

```dart
// Add to your API client
const String apiKey = 'your_mobile_app_api_key';
final Map<String, String> headers = {
  'Authorization': 'Bearer $apiKey',
  'Content-Type': 'application/json',
  'User-Agent': 'Football-Highlights-Mobile/1.0',
};
```

## Core API Endpoints

### 1. Get Highlights
**Endpoint:** `GET /highlights`

**Usage:** Fetch paginated football highlights with optional filtering.

```dart
// Request example
final response = await http.get(
  Uri.parse('$baseUrl/highlights?page=1&pageSize=20&competition=Premier+League'),
  headers: headers,
);

// Response structure
{
  "highlights": [
    {
      "id": "supersport_123",
      "title": "Manchester United vs Liverpool Highlights",
      "description": "Full match highlights including all goals",
      "thumbnailUrl": "https://example.com/thumb.jpg",
      "videoUrl": "https://example.com/video.mp4",
      "duration": 180,
      "competition": "Premier League",
      "teams": {
        "home": "Manchester United",
        "away": "Liverpool"
      },
      "score": {
        "home": 2,
        "away": 1
      },
      "matchDate": "2024-01-15T15:00:00Z",
      "views": 15000,
      "likes": 450,
      "provider": "supersport",
      "providerId": "123",
      "metadata": {
        "quality": "hd",
        "language": "en",
        "commentators": ["John Smith", "Jane Doe"],
        "tags": ["premier-league", "goals", "highlights"]
      }
    }
  ],
  "totalCount": 100,
  "page": 1,
  "pageSize": 20,
  "hasMore": true,
  "providers": {
    "supersport": 15,
    "scorebat": 5
  }
}
```

### 2. Get Single Highlight
**Endpoint:** `GET /highlights/{id}`

**Usage:** Fetch detailed information for a specific highlight.

```dart
final response = await http.get(
  Uri.parse('$baseUrl/highlights/supersport_123'),
  headers: headers,
);
```

### 3. Get Available Filters
**Endpoint:** `GET /highlights/filters`

**Usage:** Retrieve available filter options for the highlights.

```dart
final response = await http.get(
  Uri.parse('$baseUrl/highlights/filters'),
  headers: headers,
);

// Response structure
{
  "competitions": ["Premier League", "La Liga", "Serie A"],
  "teams": ["Manchester United", "Liverpool", "Barcelona"],
  "dateRange": {
    "min": "2024-01-01T00:00:00Z",
    "max": "2024-01-31T23:59:59Z"
  },
  "providers": [
    {
      "id": "supersport",
      "name": "Supersport",
      "count": 150
    },
    {
      "id": "scorebat",
      "name": "Scorebat",
      "count": 75
    }
  ]
}
```

### 4. Health Check
**Endpoint:** `GET /health`

**Usage:** Check API status and available providers.

```dart
final response = await http.get(
  Uri.parse('$baseUrl/health'),
  headers: headers,
);
```

## Flutter Implementation Guide

### 1. Data Models
Create Dart models to represent API responses:

```dart
// highlight.dart
class Highlight {
  final String id;
  final String title;
  final String description;
  final String thumbnailUrl;
  final String videoUrl;
  final int duration;
  final String competition;
  final Team teams;
  final Score? score;
  final DateTime matchDate;
  final int views;
  final int likes;
  final String provider;
  final String providerId;
  final Metadata metadata;

  Highlight({
    required this.id,
    required this.title,
    required this.description,
    required this.thumbnailUrl,
    required this.videoUrl,
    required this.duration,
    required this.competition,
    required this.teams,
    this.score,
    required this.matchDate,
    required this.views,
    required this.likes,
    required this.provider,
    required this.providerId,
    required this.metadata,
  });

  factory Highlight.fromJson(Map<String, dynamic> json) {
    return Highlight(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      thumbnailUrl: json['thumbnailUrl'],
      videoUrl: json['videoUrl'],
      duration: json['duration'],
      competition: json['competition'],
      teams: Team.fromJson(json['teams']),
      score: json['score'] != null ? Score.fromJson(json['score']) : null,
      matchDate: DateTime.parse(json['matchDate']),
      views: json['views'],
      likes: json['likes'],
      provider: json['provider'],
      providerId: json['providerId'],
      metadata: Metadata.fromJson(json['metadata']),
    );
  }
}

class Team {
  final String home;
  final String away;

  Team({required this.home, required this.away});

  factory Team.fromJson(Map<String, dynamic> json) {
    return Team(
      home: json['home'],
      away: json['away'],
    );
  }
}

class Score {
  final int home;
  final int away;

  Score({required this.home, required this.away});

  factory Score.fromJson(Map<String, dynamic> json) {
    return Score(
      home: json['home'],
      away: json['away'],
    );
  }
}

class Metadata {
  final String quality;
  final String? language;
  final List<String> commentators;
  final List<String> tags;

  Metadata({
    required this.quality,
    this.language,
    required this.commentators,
    required this.tags,
  });

  factory Metadata.fromJson(Map<String, dynamic> json) {
    return Metadata(
      quality: json['quality'],
      language: json['language'],
      commentators: List<String>.from(json['commentators']),
      tags: List<String>.from(json['tags']),
    );
  }
}
```

### 2. API Client Service
Create a reusable API client:

```dart
// api_client.dart
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiClient {
  static const String baseUrl = 'https://your-domain.com/api/v1';
  static const String apiKey = 'your_mobile_app_api_key';

  final Map<String, String> headers = {
    'Authorization': 'Bearer $apiKey',
    'Content-Type': 'application/json',
    'User-Agent': 'Football-Highlights-Mobile/1.0',
  };

  Future<List<Highlight>> getHighlights({
    int page = 1,
    int pageSize = 20,
    String? competition,
    String? team,
    String? date,
    String provider = 'all',
  }) async {
    final queryParams = {
      'page': page.toString(),
      'pageSize': pageSize.toString(),
      if (competition != null) 'competition': competition,
      if (team != null) 'team': team,
      if (date != null) 'date': date,
      'provider': provider,
    };

    final uri = Uri.parse('$baseUrl/highlights').replace(queryParameters: queryParams);
    
    try {
      final response = await http.get(uri, headers: headers);
      
      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        final List<dynamic> highlightsJson = jsonData['highlights'];
        return highlightsJson.map((json) => Highlight.fromJson(json)).toList();
      } else {
        throw Exception('Failed to load highlights: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Network error: $e');
    }
  }

  Future<Highlight> getHighlightById(String id) async {
    final response = await http.get(
      Uri.parse('$baseUrl/highlights/$id'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return Highlight.fromJson(json.decode(response.body));
    } else {
      throw Exception('Failed to load highlight: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> getFilters() async {
    final response = await http.get(
      Uri.parse('$baseUrl/highlights/filters'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to load filters: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> getHealth() async {
    final response = await http.get(
      Uri.parse('$baseUrl/health'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to get health status: ${response.statusCode}');
    }
  }
}
```

### 3. State Management with Provider
Implement state management for highlights:

```dart
// highlights_provider.dart
import 'package:flutter/foundation.dart';
import 'api_client.dart';
import 'highlight.dart';

class HighlightsProvider with ChangeNotifier {
  final ApiClient _apiClient = ApiClient();
  List<Highlight> _highlights = [];
  bool _isLoading = false;
  String? _error;
  int _currentPage = 1;
  bool _hasMore = true;

  List<Highlight> get highlights => _highlights;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get hasMore => _hasMore;

  Future<void> loadHighlights({
    String? competition,
    String? team,
    String? date,
    String provider = 'all',
    bool refresh = false,
  }) async {
    if (_isLoading) return;

    _isLoading = true;
    _error = null;
    
    if (refresh) {
      _currentPage = 1;
      _highlights.clear();
    }

    try {
      final newHighlights = await _apiClient.getHighlights(
        page: _currentPage,
        competition: competition,
        team: team,
        date: date,
        provider: provider,
      );

      _highlights.addAll(newHighlights);
      _currentPage++;
      _hasMore = newHighlights.isNotEmpty; // Simple check, adjust based on API response
      
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> refreshHighlights({
    String? competition,
    String? team,
    String? date,
    String provider = 'all',
  }) async {
    await loadHighlights(
      competition: competition,
      team: team,
      date: date,
      provider: provider,
      refresh: true,
    );
  }
}
```

### 4. Video Player Integration
Use a video player package for playback:

```yaml
# pubspec.yaml
dependencies:
  video_player: ^2.8.2
  chewie: ^1.7.2
```

```dart
// video_player_widget.dart
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';
import 'package:chewie/chewie.dart';

class VideoPlayerWidget extends StatefulWidget {
  final String videoUrl;
  final String? thumbnailUrl;

  const VideoPlayerWidget({
    Key? key,
    required this.videoUrl,
    this.thumbnailUrl,
  }) : super(key: key);

  @override
  _VideoPlayerWidgetState createState() => _VideoPlayerWidgetState();
}

class _VideoPlayerWidgetState extends State<VideoPlayerWidget> {
  late VideoPlayerController _videoPlayerController;
  ChewieController? _chewieController;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _initializePlayer();
  }

  Future<void> _initializePlayer() async {
    _videoPlayerController = VideoPlayerController.network(widget.videoUrl);
    
    await _videoPlayerController.initialize();
    
    _chewieController = ChewieController(
      videoPlayerController: _videoPlayerController,
      autoPlay: false,
      looping: false,
      aspectRatio: _videoPlayerController.value.aspectRatio,
      placeholder: widget.thumbnailUrl != null
          ? Image.network(widget.thumbnailUrl!)
          : null,
      autoInitialize: true,
    );

    setState(() {
      _isLoading = false;
    });
  }

  @override
  void dispose() {
    _videoPlayerController.dispose();
    _chewieController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Center(
        child: CircularProgressIndicator(),
      );
    }

    return Chewie(
      controller: _chewieController!,
    );
  }
}
```

### 5. Error Handling and Retry Logic
Implement robust error handling:

```dart
// error_handler.dart
import 'package:flutter/material.dart';

class ErrorHandler {
  static void showErrorSnackBar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        action: SnackBarAction(
          label: 'Retry',
          onPressed: () {
            // Implement retry logic
          },
        ),
      ),
    );
  }

  static Widget buildErrorWidget(String error, VoidCallback onRetry) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 64, color: Colors.red),
          SizedBox(height: 16),
          Text(
            'Oops! Something went wrong',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Text(
            error,
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.grey),
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: onRetry,
            child: Text('Try Again'),
          ),
        ],
      ),
    );
  }
}
```

### 6. Caching Strategy
Implement caching for better performance:

```dart
// cache_manager.dart
import 'package:hive/hive.dart';
import 'highlight.dart';

class CacheManager {
  static const String highlightsBox = 'highlights_cache';
  static const Duration cacheDuration = Duration(hours: 1);

  static Future<void> init() async {
    await Hive.initFlutter();
    Hive.registerAdapter(HighlightAdapter());
    await Hive.openBox<Highlight>(highlightsBox);
  }

  static Future<void> cacheHighlights(List<Highlight> highlights) async {
    final box = Hive.box<Highlight>(highlightsBox);
    await box.clear();
    
    for (final highlight in highlights) {
      await box.put(highlight.id, highlight);
    }
    
    await box.put('last_updated', DateTime.now().toString());
  }

  static Future<List<Highlight>?> getCachedHighlights() async {
    final box = Hive.box<Highlight>(highlightsBox);
    final lastUpdated = box.get('last_updated');
    
    if (lastUpdated != null) {
      final lastUpdateTime = DateTime.parse(lastUpdated);
      if (DateTime.now().difference(lastUpdateTime) < cacheDuration) {
        final highlights = box.values.toList();
        return highlights.isNotEmpty ? highlights : null;
      }
    }
    
    return null;
  }
}
```

### 7. Usage Example
Complete example of using the API in a Flutter screen:

```dart
// highlights_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'highlights_provider.dart';
import 'video_player_widget.dart';
import 'error_handler.dart';

class HighlightsScreen extends StatefulWidget {
  const HighlightsScreen({Key? key}) : super(key: key);

  @override
  _HighlightsScreenState createState() => _HighlightsScreenState();
}

class _HighlightsScreenState extends State<HighlightsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<HighlightsProvider>().loadHighlights();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Football Highlights'),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: () => context.read<HighlightsProvider>().refreshHighlights(),
          ),
        ],
      ),
      body: Consumer<HighlightsProvider>(
        builder: (context, provider, child) {
          if (provider.error != null) {
            return ErrorHandler.buildErrorWidget(
              provider.error!,
              () => provider.refreshHighlights(),
            );
          }

          if (provider.highlights.isEmpty && provider.isLoading) {
            return Center(child: CircularProgressIndicator());
          }

          return ListView.builder(
            itemCount: provider.highlights.length + (provider.hasMore ? 1 : 0),
            itemBuilder: (context, index) {
              if (index == provider.highlights.length) {
                return Center(child: CircularProgressIndicator());
              }

              final highlight = provider.highlights[index];
              return ListTile(
                leading: Image.network(
                  highlight.thumbnailUrl,
                  width: 60,
                  height: 60,
                  fit: BoxFit.cover,
                ),
                title: Text(highlight.title),
                subtitle: Text('${highlight.competition} • ${highlight.teams.home} vs ${highlight.teams.away}'),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => VideoPlayerScreen(
                        videoUrl: highlight.videoUrl,
                        thumbnailUrl: highlight.thumbnailUrl,
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }
}

class VideoPlayerScreen extends StatelessWidget {
  final String videoUrl;
  final String? thumbnailUrl;

  const VideoPlayerScreen({
    Key? key,
    required this.videoUrl,
    this.thumbnailUrl,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Video Player'),
      ),
      body: VideoPlayerWidget(
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl,
      ),
    );
  }
}
```

## Best Practices

### 1. Network Optimization
- Implement pagination to load data in chunks
- Use caching to reduce network requests
- Compress images and videos where possible

### 2. Error Handling
- Handle network connectivity issues
- Implement retry mechanisms for failed requests
- Provide user-friendly error messages

### 3. Performance
- Use lazy loading for lists
- Implement proper disposal of video players
- Optimize image loading with placeholders

### 4. Security
- Store API keys securely using flutter_secure_storage
- Validate all API responses
- Implement proper error logging

## Testing
Create comprehensive tests for your API integration:

```dart
// test/api_client_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'api_client.dart';

void main() {
  group('ApiClient', () {
    test('getHighlights returns list of highlights', () async {
      final client = ApiClient();
      final mockClient = MockClient((request) async {
        return http.Response('''
        {
          "highlights": [
            {
              "id": "test_1",
              "title": "Test Match",
              "description": "Test description",
              "thumbnailUrl": "https://example.com/thumb.jpg",
              "videoUrl": "https://example.com/video.mp4",
              "duration": 180,
              "competition": "Test League",
              "teams": {"home": "Team A", "away": "Team B"},
              "matchDate": "2024-01-15T15:00:00Z",
              "views": 1000,
              "likes": 50,
              "provider": "test",
              "providerId": "1",
              "metadata": {
                "quality": "hd",
                "language": "en",
                "commentators": [],
                "tags": []
              }
            }
          ],
          "totalCount": 1,
          "page": 1,
          "pageSize": 20,
          "hasMore": false,
          "providers": {"supersport": 1, "scorebat": 0}
        }
        ''', 200);
      });

      // Replace with your actual HTTP client injection method
      final highlights = await client.getHighlights();
      expect(highlights, isNotEmpty);
      expect(highlights.first.title, 'Test Match');
    });
  });
}
```

## Support
For API-related issues, contact:
- Email: api-support@your-domain.com
- Documentation: https://your-domain.com/api-docs
- Status Page: https://status.your-domain.com

This integration guide provides everything needed to successfully integrate the Football Highlights API into your Flutter mobile application.