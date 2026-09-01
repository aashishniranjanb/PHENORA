using Phenora.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for local development with Next.js
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJs",
        builder => builder
            .WithOrigins("http://localhost:3000") // Next.js default port
            .AllowAnyMethod()
            .AllowAnyHeader());
});

builder.Services.AddSingleton<AmrieInterpretationService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowNextJs");
app.UseHttpsRedirection();
app.MapControllers();

app.Run();
