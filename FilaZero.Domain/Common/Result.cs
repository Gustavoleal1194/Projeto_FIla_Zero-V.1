using System;
using System.Collections.Generic;
using System.Linq;

namespace FilaZero.Domain.Common
{
    /// <summary>
    /// Result pattern para tratamento de operações que podem falhar
    /// </summary>
    public class Result
    {
        public bool IsSuccess { get; }
        public bool IsFailure => !IsSuccess;
        public string Error { get; }
        public List<string> Errors { get; }

        protected Result(bool isSuccess, string error, List<string> errors)
        {
            IsSuccess = isSuccess;
            Error = error;
            Errors = errors ?? new List<string>();
        }

        public static Result Success() => new(true, null, null);
        public static Result Failure(string error) => new(false, error, null);
        public static Result Failure(List<string> errors) => new(false, null, errors);

        public static Result<T> Success<T>(T value) => new(value, true, null, null);
        public static Result<T> Failure<T>(string error) => new(default, false, error, null);
        public static Result<T> Failure<T>(List<string> errors) => new(default, false, null, errors);
    }

    /// <summary>
    /// Result pattern genérico para operações com retorno de valor
    /// </summary>
    public class Result<T> : Result
    {
        public T Value { get; }

        internal Result(T value, bool isSuccess, string error, List<string> errors)
            : base(isSuccess, error, errors)
        {
            Value = value;
        }

        public static implicit operator Result<T>(T value) => Success(value);
        public static implicit operator Result<T>(string error) => Failure<T>(error);
        public static implicit operator Result<T>(List<string> errors) => Failure<T>(errors);
    }

    /// <summary>
    /// Extensões para Result
    /// </summary>
    public static class ResultExtensions
    {
        public static Result<T> OnSuccess<T>(this Result<T> result, Func<T, Result<T>> func)
        {
            if (result.IsFailure)
                return result;

            return func(result.Value);
        }

        public static Result OnSuccess<T>(this Result<T> result, Func<T, Result> func)
        {
            if (result.IsFailure)
                return Result.Failure(result.Error);

            return func(result.Value);
        }

        public static Result<T> OnFailure<T>(this Result<T> result, Func<string, Result<T>> func)
        {
            if (result.IsSuccess)
                return result;

            return func(result.Error);
        }

        public static T GetValueOrDefault<T>(this Result<T> result, T defaultValue = default)
        {
            return result.IsSuccess ? result.Value : defaultValue;
        }
    }
}
