var builder = WebApplication.CreateBuilder(args);

// Add Controllers
builder.Services.AddControllers();

// Enable CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// Use CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();

// Map Controllers
app.MapControllers();

app.Run();
