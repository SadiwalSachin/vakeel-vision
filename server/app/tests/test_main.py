from fastapi.testclient import TestClient

from app.main import app

# TestClient lets us send HTTP requests to the app
# without starting a real server or opening a browser

client = TestClient(app=app)

def test_root_endpoint():
    # Simulate a GET request to the root endpoint
    response = client.get("/")
    
    # Verify the JSON response body
    assert response.status_code == 200
    
    assert response.json() == {
        "message":"Welcome to Vakeel Vision API"
    }
    
    
def test_health_endpoint():
    response = client.get("/health")
    
    assert response.status_code == 200
    
    assert response.json() == {
        "status":"healthy"
    }